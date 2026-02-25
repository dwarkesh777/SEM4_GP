import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Property, Amenity, Room, Review, PropertyImage

def clear_data():
    print("Clearing dummy data...")
    Review.objects.all().delete()
    Room.objects.all().delete()
    PropertyImage.objects.all().delete()
    Property.objects.all().delete()
    Amenity.objects.all().delete()
    
    print("Data cleared successfully.")
    print(f"Properties remaining: {Property.objects.count()}")
    print(f"Amenities remaining: {Amenity.objects.count()}")

if __name__ == '__main__':
    clear_data()
