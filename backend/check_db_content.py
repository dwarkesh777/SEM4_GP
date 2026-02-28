import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Property, User

print(f"Total Users: {User.objects.count()}")
print(f"Total Properties: {Property.objects.count()}")

print("\n--- Users List ---")
for user in User.objects.all():
    print(f"Email: {user.email}, Full Name: {user.full_name}, Is Owner: {user.is_owner}")

if Property.objects.count() > 0:
    p = Property.objects.first()
    print(f"\n--- First Property ---")
    print(f"Name: {p.name} (ID: {p.id})")
    print(f"Owner: {p.owner.email}")
else:
    print("\nNo properties found.")
