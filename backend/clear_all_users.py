import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def clear_all_users():
    """Clear all users from the database"""
    user_count = User.objects.count()
    print(f"Found {user_count} users in the database")
    
    if user_count > 0:
        # List all users before deletion
        print("Users to be deleted:")
        for user in User.objects.all():
            print(f"- {user.email} ({user.full_name}) - Owner: {user.is_owner}")
        
        # Delete all users
        User.objects.all().delete()
        print(f"\n✅ Successfully deleted {user_count} users")
    else:
        print("No users found in the database")

if __name__ == '__main__':
    clear_all_users()
