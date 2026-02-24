import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Property, Amenity, Room, Review, PropertyImage
import datetime
import json

# Load Cloudinary mapping
try:
    with open('cloudinary_mapping.json', 'r') as f:
        cloudinary_mapping = json.load(f)
except FileNotFoundError:
    print("Warning: cloudinary_mapping.json not found. Using local paths.")
    cloudinary_mapping = {}

def get_cloudinary_url(local_path):
    return cloudinary_mapping.get(local_path, local_path)

# Helper to get or create amenity
def get_amenities(names):
    return [Amenity.objects.get_or_create(name=name)[0] for name in names]

properties_data = [
    {
        "id": "sunrise-boys-hostel",
        "image": "/src/assets/hostel-1.jpg",
        "images": ["/src/assets/hostel-1.jpg", "/src/assets/hostel-2.jpg", "/src/assets/hostel-3.jpg"],
        "name": "Sunrise Boys Hostel",
        "location": "Navrangpura, Ahmedabad",
        "type": "Hostel",
        "gender": "Boys",
        "rating": 4.5,
        "reviews": 12,
        "price": 5000,
        "originalPrice": 7000,
        "amenities": ["WIFI", "FULLY FURNISHED", "HOT WATER", "SECURITY", "LAUNDRY", "PARKING"],
        "description": "Sunrise Boys Hostel offers comfortable and affordable living spaces for students and working professionals. Located in the heart of Navrangpura, it provides easy access to colleges, markets, and public transport. Our well-maintained rooms come with modern amenities to ensure a pleasant stay.",
        "rooms": [
            { "name": "4-Sharing Room", "occupancy": "4 per room", "price": 5000, "available": True },
            { "name": "3-Sharing Room", "occupancy": "3 per room", "price": 6000, "available": True },
            { "name": "2-Sharing Room", "occupancy": "2 per room", "price": 8000, "available": False },
            { "name": "Single Room", "occupancy": "1 per room", "price": 12000, "available": True },
        ],
        "reviewsList": [
            { "name": "Rahul S.", "rating": 5, "date": "2025-12-15", "comment": "Great hostel with clean rooms and friendly staff. The food is also quite good." },
            { "name": "Amit P.", "rating": 4, "date": "2025-11-20", "comment": "Nice location near my college. Wi-Fi could be better sometimes." },
            { "name": "Vikram K.", "rating": 4, "date": "2025-10-08", "comment": "Good value for money. The common areas are well maintained." },
        ],
        "address": "123, Navrangpura Main Road, Near Gujarat University, Ahmedabad - 380009",
        "phone": "+91 98765 43210",
        "email": "info@sunrisehostel.in",
    },
    {
        "id": "green-valley-pg",
        "image": "/src/assets/hostel-2.jpg",
        "images": ["/src/assets/hostel-2.jpg", "/src/assets/hostel-1.jpg", "/src/assets/hostel-6.jpg"],
        "name": "Green Valley PG",
        "location": "Memnagar, Ahmedabad",
        "type": "PG",
        "gender": "Boys",
        "rating": 4.0,
        "reviews": 8,
        "price": 7000,
        "originalPrice": 9000,
        "amenities": ["WIFI", "FULLY FURNISHED", "HOUSE KEEPING", "MATTRESS"],
        "description": "Green Valley PG is a premium paying guest accommodation offering fully furnished rooms with modern amenities. Located in the peaceful area of Memnagar, it's perfect for students looking for a quiet and comfortable living space.",
        "rooms": [
            { "name": "Triple Sharing", "occupancy": "3 per room", "price": 7000, "available": True },
            { "name": "Double Sharing", "occupancy": "2 per room", "price": 9000, "available": True },
            { "name": "Single Occupancy", "occupancy": "1 per room", "price": 14000, "available": True },
        ],
        "reviewsList": [
            { "name": "Suresh M.", "rating": 4, "date": "2025-12-01", "comment": "Decent PG with good food. Rooms are spacious." },
            { "name": "Ravi T.", "rating": 4, "date": "2025-11-15", "comment": "Clean and well-managed. Good for students." },
        ],
        "address": "45, Green Valley Road, Memnagar, Ahmedabad - 380052",
        "phone": "+91 98765 12345",
        "email": "info@greenvalleypg.in",
    },
    {
        "id": "nesthub-co-living",
        "image": "/src/assets/hostel-3.jpg",
        "images": ["/src/assets/hostel-3.jpg", "/src/assets/hostel-6.jpg", "/src/assets/hostel-1.jpg"],
        "name": "NestHub Co-Living",
        "location": "Makarba, Ahmedabad",
        "type": "Hostel",
        "gender": "Co-ed",
        "rating": 4.8,
        "reviews": 24,
        "price": 12000,
        "originalPrice": 16500,
        "amenities": ["WIFI", "FULLY FURNISHED", "HOT WATER", "AC", "TV", "LAUNDRY", "PARKING", "SECURITY"],
        "description": "NestHub Co-Living is a premium co-living space designed for modern professionals and students. With state-of-the-art amenities including AC rooms, high-speed WiFi, and vibrant community spaces, we redefine urban living.",
        "rooms": [
            { "name": "Shared Suite", "occupancy": "2 per room", "price": 12000, "available": True },
            { "name": "Private Room", "occupancy": "1 per room", "price": 18000, "available": True },
            { "name": "Premium Suite", "occupancy": "1 per room", "price": 22000, "available": False },
        ],
        "reviewsList": [
            { "name": "Priya D.", "rating": 5, "date": "2026-01-10", "comment": "Best co-living space in Ahmedabad! The community events are amazing." },
            { "name": "Arjun R.", "rating": 5, "date": "2025-12-28", "comment": "Premium facilities at a reasonable price. Highly recommend!" },
            { "name": "Sneha P.", "rating": 5, "date": "2025-12-15", "comment": "Love the vibe here. Clean, modern, and well-managed." },
            { "name": "Karan M.", "rating": 4, "date": "2025-11-30", "comment": "Great place but sometimes the common area gets crowded." },
        ],
        "address": "789, Innovation Hub, Makarba, Ahmedabad - 380051",
        "phone": "+91 98765 67890",
        "email": "hello@nesthub.in",
    },
     {
        "id": "sakhi-girls-hostel",
        "image": "/src/assets/hostel-4.jpg",
        "images": ["/src/assets/hostel-4.jpg", "/src/assets/hostel-2.jpg", "/src/assets/hostel-3.jpg"],
        "name": "Sakhi Girls Hostel",
        "location": "Satellite, Ahmedabad",
        "type": "Hostel",
        "gender": "Girls",
        "rating": 4.5,
        "reviews": 15,
        "price": 6000,
        "amenities": ["FULLY FURNISHED", "HOT WATER", "SECURITY", "LAUNDRY", "HOUSE KEEPING"],
        "description": "Sakhi Girls Hostel provides a safe, comfortable, and homely environment for female students and working professionals. With 24/7 security, CCTV surveillance, and a caring warden, parents can rest assured about their daughter's safety.",
        "rooms": [
            { "name": "4-Sharing Room", "occupancy": "4 per room", "price": 6000, "available": True },
            { "name": "3-Sharing Room", "occupancy": "3 per room", "price": 7500, "available": True },
            { "name": "2-Sharing Room", "occupancy": "2 per room", "price": 9500, "available": True },
        ],
        "reviewsList": [
            { "name": "Neha K.", "rating": 5, "date": "2026-01-05", "comment": "Very safe and clean. The warden aunty is really caring." },
            { "name": "Pooja S.", "rating": 4, "date": "2025-12-20", "comment": "Good hostel for girls. Food quality is great." },
            { "name": "Anita R.", "rating": 5, "date": "2025-11-10", "comment": "Feels like home. Security is top-notch." },
        ],
        "address": "56, Satellite Road, Near Iscon Cross, Ahmedabad - 380015",
        "phone": "+91 98765 11111",
        "email": "info@sakhihostel.in",
    },
    {
        "id": "budget-stay-hostel",
        "image": "/src/assets/hostel-5.jpg",
        "images": ["/src/assets/hostel-5.jpg", "/src/assets/hostel-1.jpg", "/src/assets/hostel-2.jpg"],
        "name": "Budget Stay Hostel",
        "location": "Nikol, Ahmedabad",
        "type": "Hostel",
        "gender": "Boys",
        "rating": 3.8,
        "reviews": 6,
        "price": 3500,
        "originalPrice": 5000,
        "amenities": ["WIFI", "FULLY FURNISHED"],
        "description": "Budget Stay Hostel offers the most affordable accommodation in Ahmedabad without compromising on basic comfort. Ideal for budget-conscious students looking for a clean and simple place to stay.",
        "rooms": [
            { "name": "6-Sharing Dorm", "occupancy": "6 per room", "price": 3500, "available": True },
            { "name": "4-Sharing Room", "occupancy": "4 per room", "price": 4500, "available": True },
            { "name": "2-Sharing Room", "occupancy": "2 per room", "price": 6500, "available": True },
        ],
        "reviewsList": [
            { "name": "Deepak L.", "rating": 4, "date": "2025-12-05", "comment": "Very affordable. Basic but clean rooms." },
            { "name": "Manish G.", "rating": 3, "date": "2025-11-25", "comment": "Good for the price. Location could be better." },
        ],
        "address": "23, Industrial Area Road, Nikol, Ahmedabad - 382350",
        "phone": "+91 98765 22222",
        "email": "info@budgetstay.in",
    },
    {
        "id": "royal-comfort-pg",
        "image": "/src/assets/hostel-6.jpg",
        "images": ["/src/assets/hostel-6.jpg", "/src/assets/hostel-3.jpg", "/src/assets/hostel-4.jpg"],
        "name": "Royal Comfort PG",
        "location": "Prahlad Nagar, Ahmedabad",
        "type": "PG",
        "gender": "Co-ed",
        "rating": 4.7,
        "reviews": 19,
        "price": 15000,
        "originalPrice": 18000,
        "amenities": ["WIFI", "FULLY FURNISHED", "HOT WATER", "SECURITY", "AC", "TV", "LAUNDRY", "PARKING"],
        "description": "Royal Comfort PG is a luxury paying guest accommodation offering premium furnished rooms with AC, attached bathroom, and all modern amenities. Perfect for working professionals who value comfort and convenience.",
        "rooms": [
            { "name": "Double Sharing AC", "occupancy": "2 per room", "price": 15000, "available": True },
            { "name": "Single AC Room", "occupancy": "1 per room", "price": 20000, "available": True },
            { "name": "Premium Suite", "occupancy": "1 per room", "price": 25000, "available": False },
        ],
        "reviewsList": [
            { "name": "Rohit B.", "rating": 5, "date": "2026-01-15", "comment": "Luxury living at its best. AC rooms are fantastic." },
            { "name": "Kavita M.", "rating": 5, "date": "2025-12-30", "comment": "Premium quality stay. Worth every penny." },
            { "name": "Sanjay D.", "rating": 4, "date": "2025-12-10", "comment": "Excellent facilities. Slightly expensive but quality is top." },
        ],
        "address": "101, Royal Heights, Prahlad Nagar, Ahmedabad - 380015",
        "phone": "+91 98765 33333",
        "email": "info@royalcomfortpg.in",
    },
]

def populate():
    # Clear existing data for fresh start
    print("Clearing existing data...")
    Review.objects.all().delete()
    Room.objects.all().delete()
    PropertyImage.objects.all().delete()
    Property.objects.all().delete()
    Amenity.objects.all().delete()
    
    print(f"Amenities remaining: {Amenity.objects.count()}")
    print(f"Properties remaining: {Property.objects.count()}")
    
    for data in properties_data:
        try:
            prop = Property.objects.create(
                id=data['id'],
                name=data['name'],
                location=data['location'],
                type=data['type'],
                gender=data['gender'],
                rating=data['rating'],
                reviews_count=data['reviews'],
                price=data['price'],
                original_price=data.get('originalPrice'),
                description=data['description'],
                address=data['address'],
                phone=data['phone'],
                email=data['email'],
                main_image=get_cloudinary_url(data['image']),
                video_url=data.get('video_url', 'https://res.cloudinary.com/demo/video/upload/v1631530588/sample_video.mp4')
            )
            
            # Set amenities
            amenity_objs = []
            for name in data['amenities']:
                amenity, _ = Amenity.objects.get_or_create(name=name)
                amenity_objs.append(amenity)
            prop.amenities.set(amenity_objs)
            
            # Set images
            for img_path in data['images']:
                PropertyImage.objects.create(property=prop, image_path=get_cloudinary_url(img_path))
            
            # Set rooms
            for room_data in data['rooms']:
                Room.objects.create(property=prop, **room_data)
            
            # Set reviews
            for review_data in data['reviewsList']:
                date_obj = datetime.datetime.strptime(review_data['date'], '%Y-%m-%d').date()
                Review.objects.create(
                    property=prop,
                    name=review_data['name'],
                    rating=review_data['rating'],
                    date=date_obj,
                    comment=review_data['comment']
                )
            print(f"Prop: {prop.name} created")
        except Exception as e:
            print(f"Error creating prop {data['id']}: {e}")

if __name__ == '__main__':
    populate()
