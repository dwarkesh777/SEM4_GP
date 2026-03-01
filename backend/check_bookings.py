import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Booking

print("All Bookings:")
bookings = Booking.objects.all()
print(f"Total: {bookings.count()}")
for b in bookings:
    print(f"ID: {b.id}, User: {b.user.email if b.user else 'Anonymous'}, Property: {b.property.name if b.property else 'N/A'}, Status: {b.status}")

print("\nAnonymous Bookings:")
anon = Booking.objects.filter(user=None)
print(f"Total Anonymous: {anon.count()}")
