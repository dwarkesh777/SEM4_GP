import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Amenity

print("Attempting to count Amenity records...")
try:
    count = Amenity.objects.count()
    print(f"Amenity count: {count}")
except Exception as e:
    import traceback
    print(f"Error: {e}")
    traceback.print_exc()

print("Attempting to fetch one Amenity...")
try:
    a = Amenity.objects.first()
    if a:
        print(f"Found Amenity: {a.name}")
    else:
        print("No Amenities found.")
except Exception as e:
    import traceback
    print(f"Error: {e}")
    traceback.print_exc()
