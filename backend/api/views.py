from rest_framework import viewsets, generics, permissions, parsers
from .models import Property
from .serializers import PropertySerializer
from .user_serializers import UserSerializer, RegisterSerializer, OwnerTokenObtainPairSerializer, UserTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(owner=self.request.user)
        else:
            serializer.save()

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

