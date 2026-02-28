import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Amenity, Appliance

amenities = [
    'WIFI', 'FULLY FURNISHED', 'AC', 'TV', 'LAUNDRY', 'HOT WATER', 
    'HOUSE KEEPING', 'MATTRESS', 'PARKING', 'SECURITY', 'FOOD', 'GYM'
]

appliances = [
    'TV', 'GEYSER', 'LAMPS', 'FRIDGE', 'AC', 'FANS', 'IRON', 
    'INDUCTION', 'WASHING MACHINE', 'WATER PURIFIER', 'MICROWAVE', 'ROUTER'
]

print("Seeding amenities...")
for a in amenities:
    obj, created = Amenity.objects.get_or_create(name=a)
    if created:
        print(f"Created Amenity: {a}")

print("\nSeeding appliances...")
for a in appliances:
    obj, created = Appliance.objects.get_or_create(name=a)
    if created:
        print(f"Created Appliance: {a}")

print("\nDone!")
