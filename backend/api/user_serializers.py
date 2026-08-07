from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    face_photo = serializers.CharField(max_length=None, required=False, allow_blank=True, allow_null=True)
    class Meta:
        model = User
        fields = (
            'id', 'email', 'full_name', 'is_owner', 'is_staff', 'is_superuser', 'is_developer', 'date_joined',
            'face_photo', 'business_name', 'business_type', 'address', 'city',
            'state', 'pincode', 'bio', 'phone_number',
            'pan_number', 'aadhar_number', 'bank_account', 'ifsc_code'
        )
        read_only_fields = ('id', 'date_joined')

    def update(self, instance, validated_data):
        face_photo = validated_data.get('face_photo')
        if face_photo and isinstance(face_photo, str) and face_photo.startswith('data:image'):
            import cloudinary.uploader
            import cloudinary
            import os
            cloudinary.config(
                cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME', 'dqddawu42'),
                api_key=os.getenv('CLOUDINARY_API_KEY', '588757514664146'),
                api_secret=os.getenv('CLOUDINARY_API_SECRET', 'zGJ3E4-oukgesomhK-Aoa55Gp6E')
            )
            import logging
            logger = logging.getLogger(__name__)
            try:
                upload_data = cloudinary.uploader.upload(face_photo, folder="owner_profiles")
                validated_data['face_photo'] = upload_data.get('secure_url') or upload_data.get('url')
            except Exception as e:
                logger.error(f"Error uploading face_photo to cloudinary: {e}")
                validated_data.pop('face_photo', None)
        return super().update(instance, validated_data)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'password', 'is_owner')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            is_owner=validated_data.get('is_owner', False)
        )
        return user

class UserTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.is_owner:
            raise serializers.ValidationError("This is an Owner account.")
        if self.user.is_developer:
            raise serializers.ValidationError("This is a Developer account.")
        if self.user.is_staff or self.user.is_superuser:
            raise serializers.ValidationError("This is an Admin/Developer account.")
        return data

class DeveloperTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_developer:
            raise serializers.ValidationError("This account does not have developer privileges.")
        return data

class OwnerTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_owner:
            raise serializers.ValidationError("This is a User account.")
        return data

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'phone_number', 'password', 'face_photo', 'is_owner')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            phone_number=validated_data.get('phone_number'),
            face_photo=validated_data.get('face_photo'),
            is_owner=False
        )
        return user

class OwnerSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'business_name', 'phone_number', 'password', 'face_photo', 'is_owner')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            phone_number=validated_data.get('phone_number'),
            business_name=validated_data.get('business_name'),
            face_photo=validated_data.get('face_photo'),
            is_owner=True
        )
        return user

class DeveloperSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'password', 'is_developer')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            is_developer=True
        )
        return user

class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_staff:
            raise serializers.ValidationError("This account does not have admin privileges.")
        return data

class AdminSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'password')

    def create(self, validated_data):
        user = User.objects.create_superuser(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
        )
        return user

