import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def reset_password(email, new_password):
    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        print(f"Password reset successfully for {email}")
        print(f"New password: {new_password}")
        return True
    except User.DoesNotExist:
        print(f"User {email} does not exist.")
        return False

if __name__ == '__main__':
    # Reset password for mrdwarkesh655@gmail.com to "test123"
    reset_password("mrdwarkesh655@gmail.com", "test123")
