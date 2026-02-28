import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Property, User

# Get or create owner
User = User
owner = User.objects.filter(is_owner=True).first()
if not owner:
    owner = User.objects.create_user(email="testowner@example.com", password="password123", full_name="Test Owner", is_owner=True)

print("Creating a test property...")
p = Property.objects.create(
    owner=owner,
    name="Test Property Shell",
    location="Test Location",
    type="Hostel",
    gender="Boys",
    price=1000,
    description="Test",
    address="Test",
    phone="123",
    email="test@test.com"
)
print(f"Created Property ID: {p.id}, Type: {type(p.id)}")

# Fetch it back
p_fetched = Property.objects.get(id=p.id)
print(f"Fetched Property ID: {p_fetched.id}")
