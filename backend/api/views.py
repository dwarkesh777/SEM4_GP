import logging
import math
import re
from django.db.models import Q
from rest_framework import viewsets, generics, permissions, parsers, status
from rest_framework.response import Response
from .models import Property, Booking, Room, Enquiry, Wishlist, User, Review, Amenity, Appliance, PropertyImage
from .serializers import PropertySerializer, BookingSerializer, EnquirySerializer, WishlistSerializer, ReviewSerializer
from .user_serializers import UserSerializer, RegisterSerializer, OwnerTokenObtainPairSerializer, UserTokenObtainPairSerializer, UserSignupSerializer, OwnerSignupSerializer, AdminSignupSerializer, AdminTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail
import requests
from django.conf import settings
import random
from django.utils import timezone
from datetime import timedelta, datetime
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes, authentication_classes, action

try:
    from sklearn.neighbors import NearestNeighbors
except Exception:  # pragma: no cover - fallback when sklearn is unavailable
    NearestNeighbors = None

logger = logging.getLogger(__name__)


def validate_external_api_key(request, mode='read'):
    provided_key = (
        request.headers.get('X-API-Key')
        or request.headers.get('HTTP_X_API_KEY')
        or request.query_params.get('api_key')
        or request.query_params.get('appid')
    )

    if not provided_key:
        return False

    if mode == 'booking':
        booking_key = getattr(settings, 'DEVELOPER_BOOKING_API_KEY', None)
        legacy_key = getattr(settings, 'DEVELOPER_API_KEY', None)
        return provided_key in {booking_key, legacy_key} if None not in {booking_key, legacy_key} else provided_key == (booking_key or legacy_key)

    readonly_key = getattr(settings, 'DEVELOPER_READONLY_API_KEY', None)
    legacy_key = getattr(settings, 'DEVELOPER_API_KEY', None)
    return provided_key in {readonly_key, legacy_key} if None not in {readonly_key, legacy_key} else provided_key == (readonly_key or legacy_key)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def public_properties(request):
    """Public endpoint for external websites to fetch hostel and PG listings."""
    if not validate_external_api_key(request, mode='read'):
        return Response({'detail': 'Missing or invalid API key.'}, status=status.HTTP_401_UNAUTHORIZED)

    queryset = Property.objects.filter(is_verified=True).order_by('-created_at')

    search_query = request.query_params.get('search')
    if search_query:
        queryset = queryset.filter(
            Q(name__icontains=search_query) |
            Q(city__icontains=search_query) |
            Q(location__icontains=search_query)
        )

    city = request.query_params.get('city')
    if city:
        queryset = queryset.filter(city__icontains=city)

    property_type = request.query_params.get('type')
    if property_type:
        queryset = queryset.filter(type__icontains=property_type)

    gender = request.query_params.get('gender')
    if gender:
        queryset = queryset.filter(gender__icontains=gender)

    min_price = request.query_params.get('min_price')
    if min_price:
        queryset = queryset.filter(price__gte=int(min_price))

    max_price = request.query_params.get('max_price')
    if max_price:
        queryset = queryset.filter(price__lte=int(max_price))

    # Count BEFORE slicing — Django cannot count a sliced queryset.
    total_count = queryset.count()

    limit = request.query_params.get('limit')
    if limit:
        try:
            queryset = queryset[:int(limit)]
        except (ValueError, TypeError):
            pass

    # Convert to list then batch-prefetch all relations in a fixed number of queries.
    properties = list(queryset)
    _manual_prefetch_properties(properties)
    serializer = PropertySerializer(properties, many=True, context={'request': request})
    response = Response({'count': total_count, 'results': serializer.data})
    # Allow clients and CDN edges to cache the public list for 60 seconds.
    response['Cache-Control'] = 'public, max-age=60, stale-while-revalidate=300'
    return response


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_external_booking(request):
    """Public endpoint for external websites to push booking details into this database."""
    if not validate_external_api_key(request, mode='booking'):
        return Response({'detail': 'Missing or invalid API key.'}, status=status.HTTP_401_UNAUTHORIZED)

    if not hasattr(request, 'data'):
        return Response({'detail': 'Request body is required.'}, status=status.HTTP_400_BAD_REQUEST)

    property_id = request.data.get('property_id')
    room_id = request.data.get('room_id')

    if not property_id or not room_id:
        return Response({'detail': 'property_id and room_id are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        property_obj = Property.objects.get(id=property_id)
        room_obj = Room.objects.get(id=room_id, property=property_obj)
    except (Property.DoesNotExist, Room.DoesNotExist):
        return Response({'detail': 'Property or room not found.'}, status=status.HTTP_404_NOT_FOUND)

    booking = Booking.objects.create(
        property=property_obj,
        room=room_obj,
        user=None,
        payment_id=request.data.get('payment_id') or None,
        razorpay_order_id=request.data.get('razorpay_order_id') or None,
        amount=request.data.get('amount') or None,
        customer_name=request.data.get('customer_name') or None,
        customer_phone=request.data.get('customer_phone') or None,
        customer_email=request.data.get('customer_email') or None,
        customer_age=request.data.get('customer_age') or None,
        status=request.data.get('status', 'Confirmed')
    )

    room_obj.available = False
    room_obj.save(update_fields=['available'])

    return Response({
        'success': True,
        'booking_id': str(booking.id),
        'status': booking.status,
        'property_name': property_obj.name,
        'room_name': room_obj.name,
        'customer_name': booking.customer_name,
        'customer_phone': booking.customer_phone,
        'customer_email': booking.customer_email,
        'customer_age': booking.customer_age,
        'amount': booking.amount,
        'payment_id': booking.payment_id,
        'razorpay_order_id': booking.razorpay_order_id,
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def developer_api_info(request):
    """Return the developer API key and usage examples for authenticated users."""
    return Response({
        'read_only_api_key': getattr(settings, 'DEVELOPER_READONLY_API_KEY', None) or getattr(settings, 'DEVELOPER_API_KEY', None),
        'booking_api_key': getattr(settings, 'DEVELOPER_BOOKING_API_KEY', None) or getattr(settings, 'DEVELOPER_API_KEY', None),
        'header_name': 'X-API-Key',
        'endpoints': {
            'list_properties': '/api/public/properties/list/',
            'hostel_detail': '/api/public/properties/detail/<id>/',
            'create_booking': '/api/public/bookings/create/',
            'booking_detail': '/api/public/bookings/detail/<id>/',
        },
        'example_headers': {
            'X-API-Key': getattr(settings, 'DEVELOPER_READONLY_API_KEY', None) or getattr(settings, 'DEVELOPER_API_KEY', None),
        },
        'example_curl': (
            f"curl -X GET '{request.build_absolute_uri('/api/public/properties/')}' "
            f"-H 'X-API-Key: {getattr(settings, 'DEVELOPER_READONLY_API_KEY', None) or getattr(settings, 'DEVELOPER_API_KEY', None)}'"
        ),
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def public_property_detail(request, property_id):
    """Public endpoint for external websites to fetch one hostel/PG listing."""
    if not validate_external_api_key(request, mode='read'):
        return Response({'detail': 'Missing or invalid API key.'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        property_obj = Property.objects.get(id=property_id, is_verified=True)
    except Property.DoesNotExist:
        return Response({'detail': 'Property not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = PropertySerializer(property_obj, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def public_booking_detail(request, booking_id):
    """Public endpoint for external websites to fetch one booking record."""
    if not validate_external_api_key(request, mode='booking'):
        return Response({'detail': 'Missing or invalid API key.'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return Response({'detail': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = BookingSerializer(booking, context={'request': request})
    return Response(serializer.data)


def _manual_prefetch_properties(properties):
    """
    Batch-load all related data for a list of Property instances and attach results
    via Django's internal _prefetched_objects_cache — the same slot that
    prefetch_related() fills, but populated manually with plain .filter() queries.

    django_mongodb_backend raises NotSupportedError for queryset.prefetch_related(),
    so this function replaces it.  The net effect is identical: RelatedManager's
    get_queryset() finds the pre-populated cache and returns data without an extra
    round-trip to MongoDB.

    For each related type (rooms, images, reviews, amenities, appliances) exactly
    ONE query is issued for the entire batch of properties, reducing O(N * relations)
    round-trips to a small fixed number.
    """
    if not properties:
        return

    from collections import defaultdict

    prop_ids = [p.id for p in properties]

    # Initialise the cache dict on every instance so get_queryset() finds it
    # even when a property has no related objects.
    for prop in properties:
        prop._prefetched_objects_cache = {}

    def _cached_qs(model_class, objects):
        """
        Return a queryset with _result_cache pre-set so Django's RelatedManager
        uses the cached list instead of running another database query.
        """
        ids = [o.id for o in objects]
        qs = model_class.objects.filter(id__in=ids) if ids else model_class.objects.none()
        qs._result_cache = list(objects)
        return qs

    # ── 1. Rooms (reverse FK) ─────────────────────────────────────────
    all_rooms = list(Room.objects.filter(property_id__in=prop_ids))
    rooms_by_prop = defaultdict(list)
    for room in all_rooms:
        rooms_by_prop[room.property_id].append(room)

    # ── 2. Confirmed-booking counts pre-attached to each Room object ─────────
    if all_rooms:
        room_ids = [r.id for r in all_rooms]
        confirmed = list(Booking.objects.filter(room_id__in=room_ids, status='Confirmed'))
        confirmed_by_room = defaultdict(list)
        for bk in confirmed:
            confirmed_by_room[bk.room_id].append(bk)
        for room in all_rooms:
            # RoomSerializer.get_booked_beds() checks this attribute first.
            room.confirmed_bookings = confirmed_by_room.get(room.id, [])

    for prop in properties:
        prop._prefetched_objects_cache['rooms'] = _cached_qs(Room, rooms_by_prop.get(prop.id, []))

    # ── 3. Images (reverse FK) ─────────────────────────────────────
    all_images = list(PropertyImage.objects.filter(property_id__in=prop_ids))
    images_by_prop = defaultdict(list)
    for img in all_images:
        images_by_prop[img.property_id].append(img)
    for prop in properties:
        prop._prefetched_objects_cache['images'] = _cached_qs(PropertyImage, images_by_prop.get(prop.id, []))

    # ── 4. Reviews (reverse FK) ────────────────────────────────────
    all_reviews = list(Review.objects.filter(property_id__in=prop_ids))
    reviews_by_prop = defaultdict(list)
    for review in all_reviews:
        reviews_by_prop[review.property_id].append(review)
    for prop in properties:
        prop._prefetched_objects_cache['reviews_list'] = _cached_qs(Review, reviews_by_prop.get(prop.id, []))

    # ── 5. Amenities (M2M via auto through-table) ────────────────────────
    try:
        AmenityThrough = Property.amenities.through
        amenity_rels = list(AmenityThrough.objects.filter(property_id__in=prop_ids))
        all_amenity_ids = list({rel.amenity_id for rel in amenity_rels})
        amenity_map = {a.id: a for a in Amenity.objects.filter(id__in=all_amenity_ids)}
        amenities_by_prop = defaultdict(list)
        for rel in amenity_rels:
            if rel.amenity_id in amenity_map:
                amenities_by_prop[rel.property_id].append(amenity_map[rel.amenity_id])
        for prop in properties:
            prop._prefetched_objects_cache['amenities'] = _cached_qs(Amenity, amenities_by_prop.get(prop.id, []))
    except Exception as exc:
        logger.debug("Amenity batch-prefetch skipped (per-property fallback): %s", exc)

    # ── 6. Appliances (M2M via auto through-table) ──────────────────────
    try:
        ApplianceThrough = Property.appliances.through
        appliance_rels = list(ApplianceThrough.objects.filter(property_id__in=prop_ids))
        all_appliance_ids = list({rel.appliance_id for rel in appliance_rels})
        appliance_map = {a.id: a for a in Appliance.objects.filter(id__in=all_appliance_ids)}
        appliances_by_prop = defaultdict(list)
        for rel in appliance_rels:
            if rel.appliance_id in appliance_map:
                appliances_by_prop[rel.property_id].append(appliance_map[rel.appliance_id])
        for prop in properties:
            prop._prefetched_objects_cache['appliances'] = _cached_qs(Appliance, appliances_by_prop.get(prop.id, []))
    except Exception as exc:
        logger.debug("Appliance batch-prefetch skipped (per-property fallback): %s", exc)


class PropertyViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        queryset = Property.objects.all().order_by('-created_at')

        # IMPORTANT: Only show verified properties on the public website
        # Admin can see all properties (including pending/rejected)
        if not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(is_verified=True)

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

        if getattr(self, 'action', None) != 'list':
            return queryset

        # 3. Limit parameter for showing top properties
        limit = self.request.query_params.get('limit')
        if limit:
            try:
                limit = int(limit)
                if limit > 0:
                    queryset = queryset[:limit]
            except (ValueError, TypeError):
                pass

        # 4. Distance calculation (if lat/lng provided)
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
                results.sort(key=lambda x: x.distance)
            except (ValueError, TypeError) as e:
                logger.error(f"Error calculating distance: {e}")

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

        # Batch-load all related data (rooms, images, reviews, amenities, appliances)
        # in a fixed number of queries instead of one query per property per relation.
        _manual_prefetch_properties(results)
        return results

    serializer_class = PropertySerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        logger.info(f"POST /api/properties/ - data keys: {list(request.data.keys())}")
        logger.info(f"POST /api/properties/ - files: {list(request.FILES.keys())}")
        logger.info(f"POST /api/properties/ - user: {request.user} authenticated: {request.user.is_authenticated}")

        try:
            # Use request.data directly — do NOT copy() it when files are present,
            # as file handles (BufferedRandom) cannot be pickled and cause a crash.
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                logger.error(f"Validation errors: {serializer.errors}")
                return Response(
                    {"error": self._flatten_errors(serializer.errors), "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )

            self.perform_create(serializer)
            logger.info(f"Property created successfully: {serializer.data.get('name')} - ID: {serializer.data.get('id')} - Status: Pending")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Unexpected error during property creation: {e}", exc_info=True)
            return Response(
                {"error": f"Something went wrong: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _flatten_errors(self, errors):
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
            # is_verified=None means "pending review" — passed here instead of copying
            # request.data (which would crash on file uploads due to BufferedRandom)
            property_instance = serializer.save(owner=self.request.user, is_verified=None)

            try:
                subject = 'Property Listed Successfully - NestNode'
                message = f'Dear {self.request.user.full_name},\n\nThank you for choosing NestNode! Your property "{property_instance.name}" has been successfully listed on our platform.\n\nWe are grateful to have you as a partner. Our team will review the listing and it will be visible to students shortly.\n\nBest regards,\nTeam NestNode'
                recipient_list = [self.request.user.email]
                send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)
                logger.info(f"Notification email sent to {self.request.user.email} for property {property_instance.name}")
            except Exception as e:
                logger.error(f"Failed to send notification email: {e}")
        else:
            from rest_framework.exceptions import AuthenticationFailed
            raise AuthenticationFailed("You must be logged in as an owner to list a property.")

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def pending(self, request):
        queryset = Property.objects.filter(is_verified__isnull=True).order_by('-created_at')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        property_obj = self.get_object()
        property_obj.is_verified = True
        property_obj.save()
        return Response({'status': 'Property approved'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        property_obj = self.get_object()
        property_obj.is_verified = False
        property_obj.save()
        return Response({'status': 'Property rejected'})



class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserSignupView(generics.CreateAPIView):
    serializer_class = UserSignupSerializer
    permission_classes = [permissions.AllowAny]


class OwnerSignupView(generics.CreateAPIView):
    serializer_class = OwnerSignupSerializer
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


class AdminSignupView(generics.CreateAPIView):
    serializer_class = AdminSignupSerializer
    permission_classes = [permissions.AllowAny]


class AdminLoginView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer


# ─── RAZORPAY PAYMENT VIEWS ───────────────────────────────────────────────────

import razorpay
import hmac
import hashlib
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication


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
                
                print(f"DEBUG: Property found: {prop_obj.name}")
                print(f"DEBUG: Room found: {room_obj.name}")
                
                # Metadata from frontend
                customer_data = request.data.get('customer_details', {})
                
                # Smart user detection fallback
                user = request.user if request.user.is_authenticated else None
                
                print(f"DEBUG: Request user: {request.user}")
                print(f"DEBUG: User authenticated: {request.user.is_authenticated}")
                print(f"DEBUG: User email: {request.user.email if request.user.is_authenticated else 'None'}")
                print(f"DEBUG: Auth header: {request.headers.get('Authorization', 'None')[:20]}...")
                
                if not user:
                    # Fallback: Find user by email provided in customer details
                    customer_email = customer_data.get('email')
                    print(f"DEBUG: Looking for user by email: {customer_email}")
                    if customer_email:
                        user = User.objects.filter(email=customer_email).first()
                        if user:
                            print(f"DEBUG: Found user by email: {user.email}")
                            logger.info(f"Fallback: Associated booking with user {user.email} via email match.")
                        else:
                            print(f"DEBUG: No user found with email: {customer_email}")
                            print(f"DEBUG: Available users: {list(User.objects.values_list('email', flat=True))}")
                    else:
                        print(f"DEBUG: No customer email provided")
                else:
                    print(f"DEBUG: Using authenticated user: {user.email}")

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
                
                # Debug: Verify the booking was created with user and property relationship
                print(f"DEBUG: Booking created - ID: {booking.id}")
                print(f"DEBUG: Booking user: {booking.user}")
                print(f"DEBUG: Booking user email: {booking.user.email if booking.user else 'None'}")
                print(f"DEBUG: Booking property: {booking.property}")
                print(f"DEBUG: Booking property name: {booking.property.name if booking.property else 'None'}")
                print(f"DEBUG: Booking property location: {booking.property.location if booking.property else 'None'}")
                print(f"DEBUG: Booking room: {booking.room}")
                print(f"DEBUG: Booking room name: {booking.room.name if booking.room else 'None'}")
                
                return Response({'verified': True, 'payment_id': payment_id, 'booking_id': str(booking.id)})
            except Exception as e:
                logger.error(f"Error saving booking: {e}", exc_info=True)
                return Response({'verified': True, 'payment_id': payment_id, 'booking_error': str(e)})
        else:
            return Response({'verified': False, 'error': 'Signature mismatch'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(f"Razorpay verification failed: {e}", exc_info=True)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
def generate_payment_receipt_pdf(booking):
    import io
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.colors import HexColor
    
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    c.setFont("Helvetica-Bold", 24)
    c.setFillColor(HexColor('#1e293b'))
    c.drawString(50, height - 80, "PAYMENT RECEIPT")
    
    c.setFont("Helvetica", 14)
    c.setFillColor(HexColor('#64748b'))
    c.drawString(50, height - 110, f"Property: {booking.property.name}")
    c.drawString(50, height - 130, f"Room: {booking.room.name if booking.room else 'N/A'}")
    
    customer_name = booking.customer_name or (booking.user.full_name if booking.user else 'Valued Resident')
    c.setFillColor(HexColor('#1e293b'))
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 170, f"Billed To: {customer_name}")
    
    date_str = booking.payment_date.strftime("%B %d, %Y") if booking.payment_date else "N/A"
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 190, f"Date: {date_str}")
    
    amount = f"INR {booking.property.price}"
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 230, f"Amount Paid: {amount}")
    
    c.setFont("Helvetica", 10)
    c.setFillColor(HexColor('#94a3b8'))
    c.drawString(50, height - 270, "Thank you for your payment!")
    
    c.save()
    pdf = buffer.getvalue()
    buffer.close()
    return pdf


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_owner:
            bookings = Booking.objects.filter(property__owner=self.request.user).order_by('-created_at')
            # Filter out bookings with broken property references
            valid_bookings = []
            for booking in bookings:
                try:
                    # Test if property exists
                    if booking.property:
                        property_name = booking.property.name
                        valid_bookings.append(booking)
                except Exception:
                    # Skip bookings with broken property references
                    continue
            return valid_bookings
        
        bookings = Booking.objects.filter(user=self.request.user).order_by('-created_at')
        # Filter out bookings with broken property references
        valid_bookings = []
        for booking in bookings:
            try:
                # Test if property exists
                if booking.property:
                    property_name = booking.property.name
                    valid_bookings.append(booking)
            except Exception:
                # Skip bookings with broken property references
                continue
        
            return valid_bookings
        
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_student(self, request):
        """Owner manually adding a student (offline booking)."""
        if not request.user.is_owner:
            return Response({'error': 'Only owners can manually add students.'}, status=status.HTTP_403_FORBIDDEN)
            
        data = request.data
        property_id = data.get('property_id')
        room_id = data.get('room_id')
        
        if not property_id or not room_id:
            return Response({'error': 'Property and Room are required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            property_obj = Property.objects.get(id=property_id, owner=request.user)
            room_obj = Room.objects.get(id=room_id, property=property_obj)
        except (Property.DoesNotExist, Room.DoesNotExist):
            return Response({'error': 'Invalid property or room.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Create booking
        booking = Booking.objects.create(
            property=property_obj,
            room=room_obj,
            status='Confirmed',
            customer_name=data.get('customer_name', ''),
            customer_email=data.get('customer_email', ''),
            customer_phone=data.get('customer_phone', ''),
            amount=room_obj.price, # Set default amount to room price
        )
        
        # Send admission confirmed email
        if booking.customer_email:
            try:
                from django.core.mail import EmailMultiAlternatives
                from django.conf import settings
                from datetime import datetime
                
                subject = f'Admission Confirmed - {property_obj.name}'
                html_content = f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        .wrapper {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; }}
                        .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }}
                        .header {{ background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px; text-align: center; }}
                        .content {{ padding: 40px; color: #1e293b; }}
                        .footer {{ text-align: center; padding: 30px; color: #94a3b8; font-size: 12px; }}
                        .details-box {{ background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin-top: 20px; }}
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <div class="container">
                            <div class="header">
                                <h1 style="color: white; margin: 0; font-size: 24px;">Admission Confirmed!</h1>
                                <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">Welcome to {property_obj.name}</p>
                            </div>
                            <div class="content">
                                <p style="font-size: 16px;">Hello <strong>{booking.customer_name or 'Resident'}</strong>,</p>
                                <p style="font-size: 16px; line-height: 1.6;">Your admission at <strong>{property_obj.name}</strong> has been successfully confirmed.</p>
                                
                                <div class="details-box">
                                    <h3 style="margin-top: 0; color: #0f172a; margin-bottom: 12px;">Booking Details:</h3>
                                    <p style="margin: 4px 0;"><strong>Room:</strong> {room_obj.name}</p>
                                    <p style="margin: 4px 0;"><strong>Rent:</strong> ₹{room_obj.price} / month</p>
                                    <p style="margin: 4px 0;"><strong>Joined Date:</strong> {datetime.now().strftime("%B %d, %Y")}</p>
                                </div>
                                <br>
                                <p style="font-size: 14px; color: #64748b;">We are excited to have you with us!</p>
                            </div>
                            <div class="footer">
                                © {datetime.now().year} NestNode • Premium Student Living Platforms
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """
                msg = EmailMultiAlternatives(
                    subject,
                    f"Hello {booking.customer_name or 'Resident'},\n\nYour admission at {property_obj.name} (Room: {room_obj.name}) has been successfully confirmed.",
                    settings.DEFAULT_FROM_EMAIL or 'noreply@nestnode.com',
                    [booking.customer_email]
                )
                msg.attach_alternative(html_content, "text/html")
                msg.send(fail_silently=True)
            except Exception as e:
                logger.error(f"Error sending admission email: {e}")
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def cancel(self, request, pk=None):
        """Cancel a booking, making its bed available again."""
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'DB error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        # Verify ownership
        try:
            if str(booking.property.owner_id) != str(request.user.id):
                return Response({'error': f'Not authorized. Booking owner: {booking.property.owner_id}, Request user: {request.user.id}'}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({'error': f'Auth check error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        try:
            # Send cancellation email before deleting the booking
            user_email = booking.customer_email or (booking.user.email if booking.user else None)
            customer_name = booking.customer_name or (booking.user.full_name if booking.user else 'Valued Resident')
            property_name = booking.property.name
            
            if user_email:
                subject = f'Important: Admission Cancelled - {property_name}'
                
                html_content = f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        .wrapper {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; }}
                        .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }}
                        .header {{ background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px; text-align: center; }}
                        .content {{ padding: 40px; color: #1e293b; }}
                        .footer {{ text-align: center; padding: 30px; color: #94a3b8; font-size: 12px; }}
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <div class="container">
                            <div class="header">
                                <h1 style="color: white; margin: 0; font-size: 24px;">Admission Cancelled</h1>
                            </div>
                            <div class="content">
                                <p style="font-size: 16px;">Hello <strong>{customer_name}</strong>,</p>
                                <p style="font-size: 16px; line-height: 1.6;">This email is to notify you that your admission and booking at <strong>{property_name}</strong> has been cancelled by the property management.</p>
                                <p style="font-size: 16px; line-height: 1.6;">If you believe this is a mistake or if you need further clarification, please contact the property owner directly.</p>
                            </div>
                            <div class="footer">
                                © NestNode • Premium Student Living Platforms
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """
                
                try:
                    from django.core.mail import send_mail
                    send_mail(
                        subject,
                        f"Hello {customer_name},\n\nYour admission at {property_name} has been cancelled by the property management. Please contact them for more details.",
                        settings.DEFAULT_FROM_EMAIL or 'noreply@nestnode.com',
                        [user_email],
                        fail_silently=True,
                        html_message=html_content
                    )
                except Exception as e:
                    logger.error(f"Failed to send cancellation email: {e}")
            
            # Finally, delete the booking
            booking.delete()
            return Response({'status': 'Booking deleted and notification sent successfully'})
        except Exception as e:
            return Response({'error': f'Delete error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def update_joined_date(self, request, pk=None):
        """Update the joined date (created_at) of a booking."""
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        # Verify ownership
        if str(booking.property.owner_id) != str(request.user.id):
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            
        new_date_str = request.data.get('created_at')
        if not new_date_str:
            return Response({'error': 'Date is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            from datetime import datetime
            from django.utils.timezone import make_aware
            
            # Parse the incoming date. Depending on frontend, it might just be YYYY-MM-DD
            parsed_date = datetime.strptime(new_date_str.split('T')[0], '%Y-%m-%d')
            # Make it timezone aware using Django's built-in utility
            aware_date = make_aware(parsed_date)
            
            booking.created_at = aware_date
            booking.save(update_fields=['created_at'])
            # Some databases/Django versions might not respect update_fields for auto_now_add, 
            # so we just do a regular save as fallback
            booking.save()
            return Response({'status': 'Date updated successfully'})
        except Exception as e:
            return Response({'error': f'Error updating date: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def update_payment_date(self, request, pk=None):
        """Update the payment date of a booking."""
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        # Verify ownership
        if str(booking.property.owner_id) != str(request.user.id):
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            
        new_date_str = request.data.get('payment_date')
        send_receipt = request.data.get('send_receipt', False)
        
        if not new_date_str:
            return Response({'error': 'Date is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            from datetime import datetime
            from django.utils.timezone import make_aware
            
            parsed_date = datetime.strptime(new_date_str.split('T')[0], '%Y-%m-%d')
            aware_date = make_aware(parsed_date)
            
            booking.payment_date = aware_date
            booking.save(update_fields=['payment_date'])
            
            if send_receipt:
                user_email = booking.customer_email or (booking.user.email if booking.user else None)
                if user_email:
                    pdf_bytes = generate_payment_receipt_pdf(booking)
                    subject = f'Payment Receipt - {booking.property.name}'
                    customer_name = booking.customer_name or (booking.user.full_name if booking.user else 'Valued Resident')
                    
                    html_content = f"""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            .wrapper {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; }}
                            .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }}
                            .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; }}
                            .content {{ padding: 40px; color: #1e293b; }}
                            .footer {{ text-align: center; padding: 30px; color: #94a3b8; font-size: 12px; }}
                        </style>
                    </head>
                    <body>
                        <div class="wrapper">
                            <div class="container">
                                <div class="header">
                                    <h1 style="color: white; margin: 0; font-size: 24px;">Payment Successful</h1>
                                    <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">Your payment has been received</p>
                                </div>
                                <div class="content">
                                    <p style="font-size: 16px;">Hello <strong>{customer_name}</strong>,</p>
                                    <p style="font-size: 16px; line-height: 1.6;">Your payment for this month at <strong>{booking.property.name}</strong> was successfully received.</p>
                                    <p style="font-size: 16px; line-height: 1.6;">Please find your payment receipt attached to this email.</p>
                                    <br>
                                    <p style="font-size: 14px; color: #64748b;">Thank you!</p>
                                </div>
                                <div class="footer">
                                    © {datetime.now().year} NestNode • Premium Student Living Platforms
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                    """
                    
                    from django.core.mail import EmailMultiAlternatives
                    msg = EmailMultiAlternatives(
                        subject,
                        f"Hello {customer_name},\n\nYour payment for this month at {booking.property.name} was successfully received. Find your receipt attached.",
                        settings.DEFAULT_FROM_EMAIL or 'noreply@nestnode.com',
                        [user_email]
                    )
                    msg.attach_alternative(html_content, "text/html")
                    msg.attach('payment_receipt.pdf', pdf_bytes, 'application/pdf')
                    try:
                        msg.send(fail_silently=True)
                    except Exception as e:
                        logger.error(f"Error sending PDF receipt: {e}")

            return Response({'status': 'Payment date updated successfully'})
        except Exception as e:
            return Response({'error': f'Error updating payment date: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def update_student_profile(self, request, pk=None):
        """Update a student's profile details in their booking."""
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        # Verify ownership
        if str(booking.property.owner_id) != str(request.user.id):
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            
        data = request.data
        if 'customer_name' in data:
            booking.customer_name = data['customer_name']
        if 'customer_email' in data:
            booking.customer_email = data['customer_email']
        if 'customer_phone' in data:
            booking.customer_phone = data['customer_phone']
            
        booking.save()
        return Response({'status': 'Student profile updated successfully'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def remind_payment(self, request, pk=None):
        """Send a beautiful HTML payment reminder email to the user."""
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'DB error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        # Verify ownership
        try:
            if str(booking.property.owner_id) != str(request.user.id):
                return Response({'error': f'Not authorized. Booking owner: {booking.property.owner_id}, Request user: {request.user.id}'}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({'error': f'Auth check error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        user_email = booking.customer_email or (booking.user.email if booking.user else None)
        if not user_email:
            return Response({'error': 'No email address associated with this booking'}, status=status.HTTP_400_BAD_REQUEST)
        
        subject = f'Pending Payment Reminder - {booking.property.name}'
        customer_name = booking.customer_name or (booking.user.full_name if booking.user else 'Valued Resident')
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .wrapper {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; }}
                .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }}
                .header {{ background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px; text-align: center; }}
                .content {{ padding: 40px; color: #1e293b; }}
                .value {{ color: #1e293b; font-size: 16px; font-weight: 600; margin-bottom: 24px; }}
                .footer {{ text-align: center; padding: 30px; color: #94a3b8; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">
                    <div class="header">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Payment Reminder</h1>
                        <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">Your upcoming payment is due</p>
                    </div>
                    <div class="content">
                        <p style="font-size: 16px;">Hello <strong>{customer_name}</strong>,</p>
                        <p style="font-size: 16px; line-height: 1.6;">This is a friendly reminder from <strong>{booking.property.owner.full_name}</strong> that your payment for this month at <strong>{booking.property.name}</strong> is currently pending.</p>
                        <p style="font-size: 16px; line-height: 1.6;">Please clear your dues at your earliest convenience to ensure uninterrupted services.</p>
                        <br>
                        <p style="font-size: 14px; color: #64748b;">If you have already made the payment, please disregard this email.</p>
                    </div>
                    <div class="footer">
                        © {datetime.now().year} NestNode • Premium Student Living Platforms
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        try:
            from django.core.mail import send_mail
            send_mail(
                subject,
                f"Hello {customer_name},\n\nYour payment for {booking.property.name} is pending. Please clear your dues.",
                settings.DEFAULT_FROM_EMAIL or 'noreply@nestnode.com',
                [user_email],
                fail_silently=False,
                html_message=html_content
            )
            return Response({'status': 'Reminder email sent successfully'})
        except Exception as e:
            logger.error(f"Failed to send payment reminder email: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

        subject = f'🏠 New Enquiry for {property_name} - NestNode'

        # Build payload for external email service
        email_payload = {
            'to': owner_email,
            'subject': subject,
            'text': f'You have a new enquiry from {student_name}: {message}',
            'template': 'enquiry',
            'property_name': property_name,
            'student_name': student_name,
            'student_phone': student_phone,
            'enquiry_message': message,
            'app_name': 'NestNode'
        }

        service_url = getattr(settings, 'EMAIL_SERVICE_URL', None)
        service_key = getattr(settings, 'EMAIL_SERVICE_API_KEY', None)

        if service_url:
            try:
                headers = {'Content-Type': 'application/json'}
                if service_key:
                    headers['x-api-key'] = service_key
                resp = requests.post(f"{service_url.rstrip('/')}/send-email", json=email_payload, headers=headers, timeout=10)
                if resp.status_code == 200:
                    logger.info(f"Enquiry notification sent to {owner_email} via external service")
                    return
                else:
                    logger.error(f"External email service failed: {resp.status_code} {resp.text}")
            except Exception as ext_e:
                logger.error(f"Error calling external email service for enquiry: {ext_e}")

        # Fallback to Django SMTP if external service not configured or failed
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
                            <a href="https://nestnode.com/dashboard" class="btn">View in Dashboard</a>
                        </div>
                    </div>
                    <div class="footer">
                        © {datetime.now().year} NestNode • Premium Student Living Platforms
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        try:
            send_mail(
                subject,
                f"You have a new enquiry for {property_name} from {student_name}.",
                settings.EMAIL_HOST_USER,
                [owner_email],
                fail_silently=False,
                html_message=html_content
            )
            logger.info(f"Enquiry notification sent to {owner_email} via SMTP fallback")
        except Exception as e:
            logger.error(f"Failed to send enquiry email via SMTP fallback: {e}")
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


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    
    def get_queryset(self):
        property_id = self.request.query_params.get('property_id')
        if property_id:
            return Review.objects.filter(property_id=property_id).order_by('-date')
        return Review.objects.all().order_by('-date')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        
        print(f"DEBUG: Review submission data: {self.request.data}")
        print(f"DEBUG: User authenticated: {self.request.user.is_authenticated if self.request.user else False}")
        print(f"DEBUG: User: {user}")
        
        # Use provided name, or fallback to user's full name, or "Anonymous"
        name = self.request.data.get('name', '').strip()
        if not name and user:
            name = user.full_name
        elif not name:
            name = "Anonymous"

        # Save the review with the evaluated name
        review = serializer.save(user=user, name=name)
        
        # Update Property rating and reviews_count
        prop = review.property
        reviews = prop.reviews_list.all()
        count = reviews.count()
        avg_rating = sum(r.rating for r in reviews) / count if count > 0 else 0
        
        prop.rating = round(avg_rating, 1)
        prop.reviews_count = count
        prop.save()
        
        print(f"DEBUG: Review saved successfully: {review.id}")
        return review

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_review_images(request):
    """
    Get all review images with property information for the gallery.
    Returns: [{
        'id': review_id,
        'image': image_url,
        'property_name': property_name,
        'property_id': property_id,
        'rating': review_rating,
        'comment': review_comment,
        'reviewer_name': reviewer_name
    }, ...]
    """
    try:
        # Get all reviews that have images
        reviews_with_images = Review.objects.filter(image__isnull=False).exclude(image='')
        
        gallery_data = []
        for review in reviews_with_images:
            if review.image and review.property:
                # Handle Cloudinary URLs properly
                image_url = None
                if review.image:
                    if review.image.url.startswith('http'):
                        # Already a full URL (Cloudinary)
                        image_url = review.image.url
                    else:
                        # Local file, build absolute URI
                        image_url = request.build_absolute_uri(review.image.url)
                
                gallery_data.append({
                    'id': str(review.id),
                    'image': image_url,
                    'property_name': review.property.name,
                    'property_id': str(review.property.id),
                    'rating': review.rating,
                    'comment': review.comment[:200] + '...' if len(review.comment) > 200 else review.comment,
                    'reviewer_name': review.name,
                    'date': review.date.strftime('%B %d, %Y')
                })
        
        print(f"DEBUG: Returning {len(gallery_data)} review images")
        for item in gallery_data:
            print(f"Image URL: {item['image']}")
        
        return Response({
            'success': True,
            'data': gallery_data,
            'count': len(gallery_data)
        })
        
    except Exception as e:
        logger.error(f"Error fetching review images: {e}")
        return Response({
            'success': False,
            'error': 'Failed to fetch review images'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='toggle')
    def toggle(self, request):
        property_id = request.data.get('property_id')
        if not property_id:
            return Response({"error": "Property ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            property_obj = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({"error": "Property not found"}, status=status.HTTP_404_NOT_FOUND)
            
        wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, property=property_obj)
        if not created:
            wishlist_item.delete()
            return Response({"wishlisted": False, "message": "Removed from wishlist"}, status=status.HTTP_200_OK)
        
        return Response({"wishlisted": True, "message": "Added to wishlist"}, status=status.HTTP_201_CREATED)


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

        # Send email via external Express SMTP service if configured
        subject = 'Your NestNode Login OTP'
        message = f'Your OTP for logging into NestNode is: {otp_code}\n\nThis code will expire in 5 minutes.'
        email_payload = {
            'to': email,
            'subject': subject,
            'text': message,
            'html': f'<p>Your OTP for logging into NestNode is: <strong>{otp_code}</strong></p><p>This code will expire in 5 minutes.</p>',
            'otp': otp_code,
            'expiry_minutes': 5,
            'app_name': 'NestNode'
        }

        service_url = getattr(settings, 'EMAIL_SERVICE_URL', None)
        service_key = getattr(settings, 'EMAIL_SERVICE_API_KEY', None)

        if service_url:
            try:
                headers = {'Content-Type': 'application/json'}
                if service_key:
                    headers['x-api-key'] = service_key
                resp = requests.post(f"{service_url.rstrip('/')}/send-email", json=email_payload, headers=headers, timeout=10)
                if resp.status_code == 200:
                    logger.info(f"OTP sent to {email} via external service")
                    return Response({"message": "OTP sent successfully to your email."})
                else:
                    logger.error(f"External email service failed: {resp.status_code} {resp.text}")
                    return Response({"error": "Failed to send email via external service."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as ext_e:
                logger.error(f"Error calling external email service: {ext_e}")
                # Fall back to Django SMTP if configured
        try:
            send_mail(subject, message, settings.EMAIL_HOST_USER, [email])
            logger.info(f"OTP sent to {email} via Django SMTP")
            return Response({"message": "OTP sent successfully to your email."})
        except Exception as mail_e:
            logger.error(f"Failed to send OTP email via SMTP: {mail_e}")
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


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_similar_properties(request, property_id):
    """
    Get similar properties using a KNN-based similarity score.
    """
    try:
        current_property = Property.objects.select_related('owner').get(id=property_id)

        def normalize_text(value):
            return re.sub(r'[^a-z0-9]+', ' ', (value or '').lower()).strip()

        def token_set(property_obj):
            tokens = set()
            for raw_value in [
                property_obj.name,
                property_obj.city,
                property_obj.location,
                property_obj.type,
                property_obj.gender,
                property_obj.description,
                property_obj.address,
            ]:
                tokens.update(normalize_text(raw_value).split())

            try:
                tokens.update(normalize_text(' '.join(property_obj.amenities.values_list('name', flat=True))).split())
            except Exception:
                pass

            try:
                tokens.update(normalize_text(' '.join(property_obj.appliances.values_list('name', flat=True))).split())
            except Exception:
                pass

            return tokens

        def jaccard_score(left_tokens, right_tokens):
            union = left_tokens | right_tokens
            if not union:
                return 0.0
            return len(left_tokens & right_tokens) / len(union)

        candidates = list(
            Property.objects.filter(is_verified=True)
            .exclude(id=property_id)
            .select_related('owner')
        )

        if not candidates:
            return Response([])

        current_tokens = token_set(current_property)
        feature_rows = []

        for candidate in candidates:
            feature_rows.append([
                float(candidate.price or 0),
                float(candidate.rating or 0),
                float(candidate.reviews_count or 0),
                float(candidate.amenities.count()),
                float(candidate.appliances.count()),
                float(candidate.rooms.count()),
                1.0 if candidate.type == current_property.type else 0.0,
                1.0 if candidate.gender == current_property.gender else 0.0,
                1.0 if normalize_text(candidate.city) == normalize_text(current_property.city) else 0.0,
            ])

        ranked_candidates = []

        if NearestNeighbors is not None:
            try:
                knn = NearestNeighbors(n_neighbors=min(6, len(feature_rows)), metric='euclidean')
                knn.fit(feature_rows)

                current_vector = [[
                    float(current_property.price or 0),
                    float(current_property.rating or 0),
                    float(current_property.reviews_count or 0),
                    float(current_property.amenities.count()),
                    float(current_property.appliances.count()),
                    float(current_property.rooms.count()),
                    1.0,
                    1.0,
                    1.0,
                ]]

                distances, indices = knn.kneighbors(current_vector)
                for distance, index in zip(distances[0], indices[0]):
                    candidate = candidates[index]
                    feature_similarity = 1 / (1 + float(distance))
                    text_similarity = jaccard_score(current_tokens, token_set(candidate))
                    combined_score = round((feature_similarity * 0.8) + (text_similarity * 0.2), 4)
                    ranked_candidates.append((combined_score, candidate))
            except Exception as e:
                logger.error(f"KNN ranking failed, falling back to heuristic: {e}")

        if not ranked_candidates:
            def fallback_score(candidate):
                price_gap = abs((candidate.price or 0) - (current_property.price or 0))
                rating_gap = abs((candidate.rating or 0) - (current_property.rating or 0))
                city_bonus = 1.0 if normalize_text(candidate.city) == normalize_text(current_property.city) else 0.0
                type_bonus = 1.0 if candidate.type == current_property.type else 0.0
                gender_bonus = 1.0 if candidate.gender == current_property.gender else 0.0
                text_bonus = jaccard_score(current_tokens, token_set(candidate))
                return (
                    (1 / (1 + price_gap)) * 0.40 +
                    (1 / (1 + rating_gap)) * 0.15 +
                    city_bonus * 0.20 +
                    type_bonus * 0.15 +
                    gender_bonus * 0.05 +
                    text_bonus * 0.05
                )

            ranked_candidates = sorted(
                [(fallback_score(candidate), candidate) for candidate in candidates],
                key=lambda item: item[0],
                reverse=True,
            )

        ranked_candidates.sort(key=lambda item: item[0], reverse=True)
        similar_properties = [candidate for _, candidate in ranked_candidates[:6]]

        serializer = PropertySerializer(similar_properties, many=True)
        return Response(serializer.data)
        
    except Property.DoesNotExist:
        return Response({'error': 'Property not found'}, status=404)
    except Exception as e:
        logger.error(f"Error fetching similar properties: {e}")
        return Response({'error': 'Failed to fetch similar properties'}, status=500)

from rest_framework.views import APIView

class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = UserSerializer

    def get_queryset(self):
        role = self.request.query_params.get('role')
        if role == 'student':
            return User.objects.filter(is_owner=False, is_staff=False)
        elif role == 'owner':
            return User.objects.filter(is_owner=True, is_staff=False)
        return User.objects.all()

class AdminAnalyticsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_properties = Property.objects.count()
        pending_properties = Property.objects.filter(is_verified__isnull=True).count()
        total_students = User.objects.filter(is_owner=False, is_staff=False).count()
        total_owners = User.objects.filter(is_owner=True, is_staff=False).count()
        total_bookings = Booking.objects.count()

        return Response({
            'total_properties': total_properties,
            'pending_properties': pending_properties,
            'total_students': total_students,
            'total_owners': total_owners,
            'total_bookings': total_bookings
        })



# Admin Views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_students_list(request):
    if not request.user.is_staff:
        return Response({'error': 'Unauthorized'}, status=403)
    
    students = User.objects.filter(is_owner=False, is_staff=False).order_by('-date_joined')
    serializer = UserSerializer(students, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_owners_list(request):
    if not request.user.is_staff:
        return Response({'error': 'Unauthorized'}, status=403)
    
    owners = User.objects.filter(is_owner=True).order_by('-date_joined')
    serializer = UserSerializer(owners, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_analytics(request):
    if not request.user.is_staff:
        return Response({'error': 'Unauthorized'}, status=403)
    
    total_bookings = Booking.objects.count()
    pending_bookings = Booking.objects.filter(status='PENDING').count()
    confirmed_bookings = Booking.objects.filter(status='CONFIRMED').count()
    cancelled_bookings = Booking.objects.filter(status='CANCELLED').count()
    
    total_properties = Property.objects.count()
    total_students = User.objects.filter(is_owner=False, is_staff=False).count()
    total_owners = User.objects.filter(is_owner=True).count()
    
    # Revenue data (approx)
    confirmed = Booking.objects.filter(status='CONFIRMED')
    total_revenue = sum(b.total_amount for b in confirmed if b.total_amount)
    
    return Response({
        'total_bookings': total_bookings,
        'booking_status': {
            'pending': pending_bookings,
            'confirmed': confirmed_bookings,
            'cancelled': cancelled_bookings
        },
        'total_properties': total_properties,
        'total_students': total_students,
        'total_owners': total_owners,
        'total_revenue': total_revenue
    })
