import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Property, User

print(f"Total Users: {User.objects.count()}")
print(f"Total Properties: {Property.objects.count()}")

if Property.objects.count() > 0:
    p = Property.objects.first()
    print(f"First Property: {p.name} (ID: {p.id})")
    print(f"Owner: {p.owner.email}")
else:
    print("No properties found.")
