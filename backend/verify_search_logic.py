import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Property
from django.db.models import Q

def test_search_logic(search_query):
    print(f"Testing search logic for: '{search_query}'")
    queryset = Property.objects.all()
    
    filtered_queryset = queryset.filter(
        Q(name__icontains=search_query) |
        Q(city__icontains=search_query) |
        Q(location__icontains=search_query)
    )
    
    print(f"Total properties: {queryset.count()}")
    print(f"Filtered properties: {filtered_queryset.count()}")
    
    for prop in filtered_queryset:
        print(f" - {prop.name} ({prop.city}, {prop.location})")
    print("-" * 30)

if __name__ == "__main__":
    # Test with a known city or name
    test_search_logic("Ahmedabad")
    test_search_logic("Hostel")
    test_search_logic("NonExistentXYZ")
