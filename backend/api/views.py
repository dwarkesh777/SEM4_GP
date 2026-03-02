import logging
from rest_framework import viewsets, generics, permissions, parsers, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
import random
import string
from .models import Property, Booking, Room, Enquiry, Wishlist, OTP
from .serializers import PropertySerializer, BookingSerializer, EnquirySerializer, WishlistSerializer
from .user_serializers import UserSerializer, RegisterSerializer, OwnerTokenObtainPairSerializer, UserTokenObtainPairSerializer

logger = logging.getLogger(__name__)


class PropertyViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        queryset = Property.objects.all()
        owner_id = self.request.query_params.get('owner_id')
        if owner_id:
            queryset = queryset.filter(owner_id=owner_id)
        return queryset
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


# ─── OTP AUTH VIEWS ───────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def request_otp(request):
    """
    Sends a 6-digit OTP to the provided email.
    Body: { email: <str> }
    """
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Generate 6-digit OTP
    otp_code = ''.join(random.choices(string.digits, k=6))
    
    # Save/Update OTP in database
    OTP.objects.update_or_create(
        email=email,
        defaults={'code': otp_code, 'is_verified': False, 'created_at': timezone.now()}
    )
    # Note: django-mongodb-backend handles auto_now_add=True for created_at

    # Send Email
    try:
        subject = f'Your NestNode Login OTP: {otp_code}'
        message = f'Welcome to NestNode! Your one-time password for login is: {otp_code}. It will expire in 10 minutes.'
        from_email = settings.DEFAULT_FROM_EMAIL
        
        send_mail(subject, message, from_email, [email])
        
        return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Failed to send OTP email: {e}")
        # For development, we return the OTP in the response if email fails (optional, but requested implicitly by "solve terminal error" context)
        # Actually, user wants it to work with email.
        return Response({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_otp(request):
    """
    Verifies OTP and returns JWT tokens.
    Body: { email: <str>, code: <str> }
    """
    email = request.data.get('email')
    code = request.data.get('code')
    is_owner = request.data.get('is_owner', False)

    if not email or not code:
        return Response({'error': 'Email and code are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        otp_obj = OTP.objects.filter(email=email, code=code).last()
        
        if not otp_obj:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
        
        if otp_obj.is_expired():
            return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark as verified
        otp_obj.is_verified = True
        otp_obj.save()

        # Get or create user
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        user = User.objects.filter(email=email).first()
        created = False
        
        if not user:
            # Create a brand new user
            user = User.objects.create_user(
                email=email,
                password=None, # No password needed for OTP-only users
                full_name=email.split('@')[0],
                is_owner=is_owner
            )
            created = True
            logger.info(f"Created new user {email} with is_owner={is_owner} via OTP.")
        else:
            # User exists, check if roles match portal expectations
            if is_owner and not user.is_owner:
                return Response({'error': 'This account is not registered as an owner. Please use the Student Portal.'}, status=status.HTTP_403_FORBIDDEN)
            if not is_owner and user.is_owner:
                return Response({'error': 'This is an owner account. Please login via the Owner Portal.'}, status=status.HTTP_403_FORBIDDEN)

        # Generate JWT Tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
            'is_new_user': created
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"OTP verification failed: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─── RAZORPAY PAYMENT VIEWS ───────────────────────────────────────────────────

import razorpay
import hmac
import hashlib
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication


def get_razorpay_client():
    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([AllowAny])
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
@authentication_classes([JWTAuthentication])
@permission_classes([AllowAny])
def verify_razorpay_payment(request):
    """
    Verifies Razorpay payment signature after checkout.
    Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    """
    logger.info(f"Payment Verification - User: {request.user}, Authenticated: {request.user.is_authenticated}")
    if request.user.is_authenticated:
        logger.info(f"Authenticated User Email: {request.user.email}")
    
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

        if expected == signature:
            # Payment verified, now save the booking
            try:
                property_id = request.data.get('property_id')
                room_id = request.data.get('room_id')
                
                # Fetch instances to handle UUID/ObjectId correctly
                prop_obj = Property.objects.get(id=property_id)
                room_obj = Room.objects.get(id=room_id)
                
                # Metadata from frontend
                customer_data = request.data.get('customer_details', {})
                
                # Smart user detection fallback
                user = request.user if request.user.is_authenticated else None
                if not user:
                    # Fallback: Find user by email provided in customer details
                    customer_email = customer_data.get('email')
                    if customer_email:
                        user = User.objects.filter(email=customer_email).first()
                        if user:
                            logger.info(f"Fallback: Associated booking with user {user.email} via email match.")

                booking = Booking.objects.create(
                    user=user,
                    property=prop_obj,
                    room=room_obj,
                    payment_id=payment_id,
                    razorpay_order_id=order_id,
                    amount=request.data.get('amount'),
                    customer_name=customer_data.get('name'),
                    customer_phone=customer_data.get('phone'),
                    customer_email=customer_data.get('email'),
                    customer_age=customer_data.get('age'),
                    status='Confirmed'
                )
                return Response({'verified': True, 'payment_id': payment_id, 'booking_id': str(booking.id)})
            except Exception as e:
                logger.error(f"Error saving booking: {e}", exc_info=True)
                return Response({'verified': True, 'payment_id': payment_id, 'booking_error': str(e)})
        else:
            return Response({'verified': False, 'error': 'Signature mismatch'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(f"Razorpay verification failed: {e}", exc_info=True)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BookingViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_owner:
            return Booking.objects.filter(property__owner=self.request.user).order_by('-created_at')
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')


class EnquiryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EnquirySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enquiry.objects.filter(user=self.request.user).order_by('-created_at')


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
