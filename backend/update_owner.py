import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def make_owner(email):
    try:
        user = User.objects.get(email=email)
        user.is_owner = True
        user.save()
        print(f"User {email} successfully updated to owner.")
    except User.DoesNotExist:
        print(f"User {email} not found.")

if __name__ == '__main__':
    make_owner("mrdwarkesh651@gmail.com")
