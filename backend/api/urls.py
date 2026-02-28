from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import PropertyViewSet, RegisterView, UserProfileView, OwnerLoginView, UserLoginView, create_razorpay_order, verify_razorpay_payment

router = DefaultRouter()
router.register(r'properties', PropertyViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    path('auth/login/', UserLoginView.as_view(), name='token_obtain_pair'),
    path('auth/owner/login/', OwnerLoginView.as_view(), name='owner_token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('payment/create-order/', create_razorpay_order, name='create_razorpay_order'),
    path('payment/verify/', verify_razorpay_payment, name='verify_razorpay_payment'),
]
# hii4