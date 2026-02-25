import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Amenity, Appliance

amenities = [
    "wifi", "fully_furnished", "ac", "tv", "laundry", 
    "hot_water", "house_keeping", "mattress", "parking", 
    "security", "food", "gym"
]

appliances = [
    "tv_app", "geyser", "lamps", "fridge", "ac_app", 
    "fans", "iron", "induction", "washing_machine", 
    "water_purifier", "microwave", "router"
]

print("Populating Amenities...")
for name in amenities:
    obj, created = Amenity.objects.get_or_create(name=name)
    if created:
        print(f"Created Amenity: {name}")

print("\nPopulating Appliances...")
for name in appliances:
    obj, created = Appliance.objects.get_or_create(name=name)
    if created:
        print(f"Created Appliance: {name}")

print("\nDone!")
