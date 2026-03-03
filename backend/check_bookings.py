import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Booking, User, Property

print("--- Quick ID Check ---")
u = User.objects.first()
if u:
    print(f"User ID: {u.id} ({type(u.id)})")

p = Property.objects.first()
if p:
    print(f"Property ID: {p.id} ({type(p.id)})")
    print(f"Property Owner ID: {p.owner_id} ({type(p.owner_id)})")

b = Booking.objects.first()
if b:
    print(f"Booking ID: {b.id} ({type(b.id)})")
    print(f"Booking Property ID: {b.property_id} ({type(b.property_id)})")
    print(f"Booking User ID: {b.user_id} ({type(b.user_id)})")

print("\n--- Owner Filtering Test ---")
owner = User.objects.filter(email='mrdwarkesh65@gmail.com').first()
if owner:
    print(f"Testing for owner: {owner.email} (ID: {owner.id})")
    props = list(Property.objects.filter(owner=owner))
    ids = [p.id for p in props]
    print(f"Owned Property names: {[p.name for p in props]}")
    print(f"Owned Property IDs: {ids}")
    count = Booking.objects.filter(property_id__in=ids).count()
    print(f"Bookings found via ID filter: {count}")
    
    # Check one booking manually
    if count > 0:
        b = Booking.objects.filter(property_id__in=ids).first()
        print(f"Sample Booking ID: {b.id}, Property: {b.property.name}")
else:
    print("Owner mrdwarkesh65@gmail.com not found!")
    
    # Also test the student filter for this owner (just in case)
    b_count = Booking.objects.filter(user=owner).count()
    print(f"Bookings found where this owner is the student: {b_count}")
else:
    print("No owner found in database!")
