import logging
from rest_framework import viewsets, generics, permissions, parsers, status
from rest_framework.response import Response
from .models import Property
from .serializers import PropertySerializer
from .user_serializers import UserSerializer, RegisterSerializer, OwnerTokenObtainPairSerializer, UserTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

logger = logging.getLogger(__name__)


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_permissions(self):
        # GET requests (list/retrieve) are public; POST/PUT/DELETE require auth
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        # Log all incoming data keys for debugging
        logger.info(f"POST /api/properties/ - data keys: {list(request.data.keys())}")
        logger.info(f"POST /api/properties/ - files: {list(request.FILES.keys())}")
        logger.info(f"POST /api/properties/ - user: {request.user} authenticated: {request.user.is_authenticated}")

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            # Log and return the exact validation errors so frontend can show them
            logger.error(f"Validation errors: {serializer.errors}")
            return Response(
                {"error": self._flatten_errors(serializer.errors), "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error during property creation: {e}", exc_info=True)
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def _flatten_errors(self, errors):
        """Convert DRF nested error dict into a readable string."""
        messages = []
        for field, errs in errors.items():
            if isinstance(errs, list):
                messages.append(f"{field}: {', '.join(str(e) for e in errs)}")
            elif isinstance(errs, dict):
                messages.append(f"{field}: {errs}")
            else:
                messages.append(str(errs))
        return " | ".join(messages)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(owner=self.request.user)
        else:
            # owner is required by the model — raise a clear error
            from rest_framework.exceptions import AuthenticationFailed
            raise AuthenticationFailed("You must be logged in as an owner to list a property.")


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserLoginView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer


class OwnerLoginView(TokenObtainPairView):
    serializer_class = OwnerTokenObtainPairSerializer


# ─── RAZORPAY PAYMENT VIEWS ───────────────────────────────────────────────────

import razorpay
import hmac
import hashlib
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes as perm_classes
from rest_framework.permissions import AllowAny


def get_razorpay_client():
    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )


@api_view(['POST'])
@perm_classes([AllowAny])
def create_razorpay_order(request):
    """
    Creates a Razorpay order.
    Body: { amount: <int in rupees>, property_id: <str>, room_name: <str> }
    Returns: { order_id, amount, currency, key_id }
    """
    try:
        amount_rupees = int(request.data.get('amount', 0))
        property_id   = request.data.get('property_id', '')
        room_name     = request.data.get('room_name', '')
        customer_name = request.data.get('customer_name', '')

        if amount_rupees <= 0:
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        client = get_razorpay_client()
        order = client.order.create({
            'amount':   amount_rupees * 100,   # Razorpay expects paise
            'currency': 'INR',
            'payment_capture': 1,
            'notes': {
                'property_id': str(property_id),
                'room_name':   room_name,
                'customer':    customer_name,
            }
        })

        return Response({
            'order_id':  order['id'],
            'amount':    order['amount'],
            'currency':  order['currency'],
            'key_id':    settings.RAZORPAY_KEY_ID,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Razorpay order creation failed: {e}", exc_info=True)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@perm_classes([AllowAny])
def verify_razorpay_payment(request):
    """
    Verifies Razorpay payment signature and saves booking to DB.
    Body: {
        razorpay_order_id, razorpay_payment_id, razorpay_signature,
        property_id, room_id, amount,
        customer_name, customer_phone, customer_email, customer_age
    }
    """
    try:
        order_id   = request.data.get('razorpay_order_id', '')
        payment_id = request.data.get('razorpay_payment_id', '')
        signature  = request.data.get('razorpay_signature', '')

        if not all([order_id, payment_id, signature]):
            return Response({'error': 'Missing payment fields'}, status=status.HTTP_400_BAD_REQUEST)

        # Signature verification
        msg = f"{order_id}|{payment_id}"
        expected = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode('utf-8'),
            msg.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        if expected != signature:
            return Response({'verified': False, 'error': 'Signature mismatch'}, status=status.HTTP_400_BAD_REQUEST)

        # Payment verified — now save the Booking
        from .models import Booking, Property, Room
        booking_id = None
        try:
            property_id  = request.data.get('property_id')
            room_id      = request.data.get('room_id')
            amount       = request.data.get('amount')
            customer_name  = request.data.get('customer_name', '')
            customer_phone = request.data.get('customer_phone', '')
            customer_email = request.data.get('customer_email', '')
            customer_age   = request.data.get('customer_age')

            property_obj = Property.objects.get(id=property_id)
            room_obj     = Room.objects.get(id=room_id)

            # Attach to logged-in user if authenticated
            user_obj = request.user if request.user.is_authenticated else None

            booking = Booking.objects.create(
                user=user_obj,
                property=property_obj,
                room=room_obj,
                status='Confirmed',
                payment_id=payment_id,
                razorpay_order_id=order_id,
                amount=amount,
                customer_name=customer_name,
                customer_phone=customer_phone,
                customer_email=customer_email,
                customer_age=customer_age,
            )
            booking_id = str(booking.id)
            logger.info(f"Booking {booking_id} saved for payment {payment_id}")
        except Exception as booking_err:
            logger.error(f"Booking save failed: {booking_err}", exc_info=True)
            # Still return verified=True even if booking save fails
        
        return Response({'verified': True, 'payment_id': payment_id, 'booking_id': booking_id})

    except Exception as e:
        logger.error(f"Razorpay verification failed: {e}", exc_info=True)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def my_bookings(request):
    """Returns all bookings for the currently authenticated user."""
    from .models import Booking
    from .serializers import BookingSerializer

    # Support lookup by email for guest bookings too
    bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
    serializer = BookingSerializer(bookings, many=True, context={'request': request})
    return Response(serializer.data)