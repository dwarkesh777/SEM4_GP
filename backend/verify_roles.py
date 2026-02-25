import os
import django
from rest_framework.exceptions import ValidationError

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.user_serializers import UserTokenObtainPairSerializer, OwnerTokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

def verify_restrictions():
    owner_email = "mrdwarkesh651@gmail.com" # We made this user an owner
    owner_password = "ownerpassword123" # Assuming password from previous scripts or known
    
    user = User.objects.get(email=owner_email)
    print(f"Testing User: {user.email}, Is Owner: {user.is_owner}")

    # 1. Test Owner trying to use User Login
    print("\nAttempting Owner Login through User Serializer...")
    serializer = UserTokenObtainPairSerializer()
    serializer.user = user
    try:
        serializer.validate({})
        print("FAIL: Owner was able to use User Login!")
    except ValidationError as e:
        print(f"SUCCESS: Owner blocked with message: {e.detail[0]}")

    # 2. Test Regular User trying to use Owner Login
    # Create a dummy regular user
    reg_email = "regular@test.com"
    if not User.objects.filter(email=reg_email).exists():
        User.objects.create_user(email=reg_email, password="password", full_name="Regular User", is_owner=False)
    reg_user = User.objects.get(email=reg_email)
    
    print(f"\nTesting User: {reg_user.email}, Is Owner: {reg_user.is_owner}")
    print("Attempting Regular User Login through Owner Serializer...")
    owner_serializer = OwnerTokenObtainPairSerializer()
    owner_serializer.user = reg_user
    try:
        owner_serializer.validate({})
        print("FAIL: Regular user was able to use Owner Login!")
    except ValidationError as e:
        print(f"SUCCESS: Regular user blocked with message: {e.detail[0]}")

if __name__ == '__main__':
    verify_restrictions()
