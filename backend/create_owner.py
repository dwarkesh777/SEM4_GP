import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_owner():
    email = "owner@test.com"
    password = "ownerpassword123"
    full_name = "Test Owner"
    
    if User.objects.filter(email=email).exists():
        user = User.objects.get(email=email)
        user.is_owner = True
        user.set_password(password)
        user.save()
        print(f"User {email} updated to owner.")
    else:
        User.objects.create_user(
            email=email,
            password=password,
            full_name=full_name,
            is_owner=True
        )
        print(f"Owner user {email} created.")

if __name__ == '__main__':
    create_owner()
