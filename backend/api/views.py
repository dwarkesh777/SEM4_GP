import logging
import math
from django.db.models import Q
from rest_framework import viewsets, generics, permissions, parsers, status
from rest_framework.response import Response
from .models import Property, Booking, Room, Enquiry, Wishlist, User
from .serializers import PropertySerializer, BookingSerializer, EnquirySerializer, WishlistSerializer
from .user_serializers import UserSerializer, RegisterSerializer, OwnerTokenObtainPairSerializer, UserTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail
from django.conf import settings
import random
from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes, authentication_classes
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
import os

logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
try:
    # Try to load from environment variable or standard filename
    cred_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_JSON', os.path.join(settings.BASE_DIR, 'firebase-service-account.json'))
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin initialized successfully.")
    else:
        logger.warning("Firebase service account JSON not found. Firebase Login will not work.")
except Exception as e:
    logger.error(f"Error initializing Firebase Admin: {e}")


class PropertyViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        queryset = Property.objects.all()
        
        # 1. Base Filters
        owner_id = self.request.query_params.get('owner_id')
        if owner_id:
            queryset = queryset.filter(owner_id=owner_id)
            
        search_query = self.request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(city__icontains=search_query) |
                Q(location__icontains=search_query)
            )

        # 2. Advanced Filters
        genders = self.request.query_params.getlist('gender')
        if genders:
            queryset = queryset.filter(gender__in=genders)

        types = self.request.query_params.getlist('type')
        if types:
            queryset = queryset.filter(type__in=types)

        amenities = self.request.query_params.getlist('amenities')
        if amenities:
            for amenity in amenities:
                queryset = queryset.filter(amenities__name__icontains=amenity)

        min_price = self.request.query_params.get('min_price')
        if min_price:
            queryset = queryset.filter(price__gte=int(min_price))

        max_price = self.request.query_params.get('max_price')
        if max_price:
            queryset = queryset.filter(price__lte=int(max_price))

        # 3. Distance calculation (if lat/lng provided)
        college_lat = self.request.query_params.get('lat')
        college_lng = self.request.query_params.get('lng')
        
        results = list(queryset)
        if college_lat and college_lng:
            try:
                c_lat = float(college_lat)
                c_lng = float(college_lng)
                
                filtered_results = []
                for prop in results:
                    if prop.latitude is not None and prop.longitude is not None:
                        # Haversine formula
                        R = 6371.0
                        lat1, lon1 = math.radians(c_lat), math.radians(c_lng)
                        lat2, lon2 = math.radians(prop.latitude), math.radians(prop.longitude)
                        
                        dlat = lat2 - lat1
                        dlon = lon2 - lon1
                        
                        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
                        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
                        distance = R * c
                        
                        if distance <= 30:
                            prop.distance = round(distance, 2)
                            filtered_results.append(prop)
                results = filtered_results
                # Default sorting for distance search
                results.sort(key=lambda x: x.distance)
            except (ValueError, TypeError) as e:
                logger.error(f"Error calculating distance: {e}")

        # 4. Sorting (only if not distance-sorted or if explicit sort provided)
        ordering = self.request.query_params.get('ordering')
        if ordering:
            if ordering == 'price_asc':
                results.sort(key=lambda x: x.price)
            elif ordering == 'price_desc':
                results.sort(key=lambda x: x.price, reverse=True)
            elif ordering == 'rating_desc':
                results.sort(key=lambda x: x.rating, reverse=True)
            elif ordering == 'distance_asc' and hasattr(results[0] if results else None, 'distance'):
                results.sort(key=lambda x: x.distance)
        
        return results
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
            property_instance = serializer.save(owner=self.request.user)
            
            # Send grateful email to owner
            try:
                subject = 'Property Listed Successfully - BedBuddy'
                message = f'Dear {self.request.user.full_name},\n\nThank you for choosing BedBuddy! Your property "{property_instance.name}" has been successfully listed on our platform.\n\nWe are grateful to have you as a partner. Our team will review the listing and it will be visible to students shortly.\n\nBest regards,\nTeam BedBuddy'
                recipient_list = [self.request.user.email]
                send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)
                logger.info(f"Notification email sent to {self.request.user.email} for property {property_instance.name}")
            except Exception as e:
                logger.error(f"Failed to send notification email: {e}")
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


def send_enquiry_notification_email(enquiry):
    """
    Sends a beautiful HTML email to the property owner about a new enquiry.
    """
    try:
        owner_email = enquiry.property.owner.email
        property_name = enquiry.property.name
        student_name = enquiry.name or "A Student"
        student_phone = enquiry.phone or "Not provided"
        message = enquiry.message

        subject = f'🏠 New Enquiry for {property_name} - BedBuddy'
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .wrapper {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; }}
                .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }}
                .header {{ background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px; text-align: center; }}
                .content {{ padding: 40px; color: #1e293b; }}
                .label {{ color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }}
                .value {{ color: #1e293b; font-size: 16px; font-weight: 600; margin-bottom: 24px; }}
                .message-box {{ background: #f1f5f9; border-radius: 16px; padding: 24px; font-style: italic; color: #475569; border-left: 4px solid #4f46e5; }}
                .footer {{ text-align: center; padding: 30px; color: #94a3b8; font-size: 12px; }}
                .btn {{ display: inline-block; background: #4f46e5; color: white !important; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">
                    <div class="header">
                        <h1 style="color: white; margin: 0; font-size: 24px;">New Enquiry Received!</h1>
                        <p style="color: rgba(255,255,255,0.8); margin-top: 8px;">Someone is interested in your property</p>
                    </div>
                    <div class="content">
                        <div class="label">Property</div>
                        <div class="value">{property_name}</div>
                        
                        <div class="label">Student Name</div>
                        <div class="value">{student_name}</div>
                        
                        <div class="label">Contact Number</div>
                        <div class="value">{student_phone}</div>
                        
                        <div class="label">Enquiry Message</div>
                        <div class="message-box">"{message}"</div>
                        
                        <div style="text-align: center;">
                            <a href="https://bedbuddy.com/dashboard" class="btn">View in Dashboard</a>
                        </div>
                    </div>
                    <div class="footer">
                        © 2024 BedBuddy • Premium Student Living Platforms
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        send_mail(
            subject,
            f"You have a new enquiry for {property_name} from {student_name}.",
            settings.EMAIL_HOST_USER,
            [owner_email],
            fail_silently=False,
            html_message=html_content
        )
        logger.info(f"Enquiry notification sent to {owner_email}")
    except Exception as e:
        logger.error(f"Failed to send enquiry email: {e}")

class EnquiryViewSet(viewsets.ModelViewSet):
    serializer_class = EnquirySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_owner:
            return Enquiry.objects.filter(property__owner=self.request.user).order_by('-created_at')
        return Enquiry.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        enquiry = serializer.save(user=self.request.user)
        # Trigger notification email
        send_enquiry_notification_email(enquiry)


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ─── OTP AUTHENTICATION VIEWS ───────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def send_otp(request):
    """
    Generates and sends a 6-digit OTP to the user's email.
    Body: { "email": "user@example.com" }
    """
    try:
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "No account found with this email."}, status=status.HTTP_404_NOT_FOUND)

        # Generate 6-digit OTP
        otp_code = str(random.randint(100000, 999999))
        user.otp_code = otp_code
        user.otp_expiry = timezone.now() + timedelta(minutes=5)
        user.save()

        # Send email
        subject = 'Your BedBuddy Login OTP'
        message = f'Your OTP for logging into BedBuddy is: {otp_code}\n\nThis code will expire in 5 minutes.'
        try:
            send_mail(subject, message, settings.EMAIL_HOST_USER, [email])
            logger.info(f"OTP sent to {email}")
            return Response({"message": "OTP sent successfully to your email."})
        except Exception as mail_e:
            logger.error(f"Failed to send OTP email: {mail_e}")
            return Response({"error": f"Failed to send email: {str(mail_e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        logger.error(f"OTP generation error: {e}")
        return Response({"error": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_otp(request):
    """
    Verifies the OTP and returns JWT tokens.
    Body: { "email": "user@example.com", "otp": "123456" }
    """
    try:
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({"error": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "No account found with this email."}, status=status.HTTP_404_NOT_FOUND)

        # Verify matching code and expiry
        if user.otp_code != otp:
            return Response({"error": "Invalid OTP code."}, status=status.HTTP_400_BAD_REQUEST)

        if user.otp_expiry < timezone.now():
            return Response({"error": "OTP has expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

        # Success: Clear OTP and generate tokens
        user.otp_code = None
        user.otp_expiry = None
        user.save()

        refresh = RefreshToken.for_user(user)
        try:
            user_data = UserSerializer(user).data
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_data
            })
        except Exception as ser_e:
            logger.error(f"User serialization error: {ser_e}")
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {'email': user.email, 'id': str(user.id)}
            })

    except Exception as e:
        logger.error(f"OTP verification error: {e}")
        return Response({"error": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def firebase_login(request):
    """
    Verifies a Firebase ID token and returns JWT tokens.
    Body: { "token": "firebase-id-token" }
    """
    try:
        token = request.data.get('token')
        if not token:
            return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Verify the Firebase token
        try:
            decoded_token = firebase_auth.verify_id_token(token)
            uid = decoded_token['uid']
            email = decoded_token.get('email')
            full_name = decoded_token.get('name', '')
            
            if not email:
                return Response({"error": "Google account must have an email."}, status=status.HTTP_400_BAD_REQUEST)

            # Get or create the user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'full_name': full_name,
                    'is_owner': False,  # Default to student for Google login
                }
            )

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_data,
                'created': created
            })

        except Exception as auth_e:
            logger.error(f"Firebase token verification failed: {auth_e}")
            return Response({"error": "Invalid or expired Firebase token."}, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        logger.error(f"Firebase login error: {e}")
        return Response({"error": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
