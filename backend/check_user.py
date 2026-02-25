import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def check_user(email):
    try:
        user = User.objects.get(email=email)
        print(f"User: {user.email}")
        print(f"Full Name: {user.full_name}")
        print(f"Is Owner: {user.is_owner}")
        print(f"Is Staff: {user.is_staff}")
        print(f"Is Active: {user.is_active}")
    except User.DoesNotExist:
        print(f"User {email} does not exist.")

if __name__ == '__main__':
    check_user("mrdwarkesh651@gmail.com")
