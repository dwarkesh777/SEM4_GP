import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_test_users():
    """Create test student and owner accounts"""
    
    # Test Student
    try:
        student = User.objects.create_user(
            email='student@test.com',
            full_name='Test Student',
            password='student123',
            is_owner=False
        )
        print(f"✅ Created student: {student.email}")
    except Exception as e:
        print(f"❌ Student creation failed: {e}")
    
    # Test Owner
    try:
        owner = User.objects.create_user(
            email='owner@test.com',
            full_name='Test Owner',
            password='owner123',
            is_owner=True
        )
        print(f"✅ Created owner: {owner.email}")
    except Exception as e:
        print(f"❌ Owner creation failed: {e}")

if __name__ == '__main__':
    print("Creating test users...")
    create_test_users()
    
    print("\nAll users in database:")
    for user in User.objects.all():
        print(f"- {user.email} ({user.full_name}) - Owner: {user.is_owner}")
    
    print("\nTest Credentials:")
    print("Student: student@test.com / student123")
    print("Owner: owner@test.com / owner123")
