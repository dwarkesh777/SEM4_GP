from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import PropertyViewSet, RegisterView, UserProfileView, OwnerLoginView, UserLoginView, create_razorpay_order, verify_razorpay_payment, BookingViewSet, EnquiryViewSet, WishlistViewSet, send_otp, verify_otp, ReviewViewSet, get_review_images, get_similar_properties, UserSignupView, OwnerSignupView
from .colleges_view import get_colleges

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'enquiries', EnquiryViewSet, basename='enquiry')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
    path('colleges/', get_colleges, name='get_colleges'),
    path('review-images/', get_review_images, name='get_review_images'),
    path('properties/<uuid:property_id>/similar/', get_similar_properties, name='get_similar_properties'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/signup/user', UserSignupView.as_view(), name='signup_user'),
    path('auth/signup/owner', OwnerSignupView.as_view(), name='signup_owner'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    path('auth/login/', UserLoginView.as_view(), name='token_obtain_pair'),
    path('auth/owner/login/', OwnerLoginView.as_view(), name='owner_token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/send-otp/', send_otp, name='send_otp'),
    path('auth/verify-otp/', verify_otp, name='verify_otp'),
    path('payment/create-order/', create_razorpay_order, name='create_razorpay_order'),
    path('payment/verify/', verify_razorpay_payment, name='verify_razorpay_payment'),
]
# hii4