from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import PropertyViewSet, RegisterView, UserProfileView, OwnerLoginView, UserLoginView
from .booking_views import (
    BookingCreateView, PaymentVerifyView, UserBookingsView, 
    BookingReceiptView, booking_stats
)

router = DefaultRouter()
router.register(r'properties', PropertyViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', UserLoginView.as_view(), name='token_obtain_pair'),
    path('auth/owner/login/', OwnerLoginView.as_view(), name='owner_token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    
    # Booking endpoints
    path('bookings/create/', BookingCreateView.as_view(), name='booking_create'),
    path('bookings/', UserBookingsView.as_view(), name='user_bookings'),
    path('bookings/<uuid:booking_id>/receipt/', BookingReceiptView.as_view(), name='booking_receipt'),
    path('bookings/stats/', booking_stats, name='booking_stats'),
    
    # Payment endpoints
    path('payments/create-order/', BookingCreateView.as_view(), name='create_payment_order'),
    path('payments/verify/', PaymentVerifyView.as_view(), name='verify_payment'),
]
