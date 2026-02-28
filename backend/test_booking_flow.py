import os
import django
import hmac
import hashlib
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import User, Property, Room, Booking
from rest_framework.test import APIClient
from django.urls import reverse

def test_booking_creation():
    client = APIClient()
    
    # 1. Get or create a test user
    email = "test_student@example.com"
    user, created = User.objects.get_or_create(email=email, defaults={'full_name': 'Test Student'})
    if created:
        user.set_password("password123")
        user.save()
    
    client.force_authenticate(user=user)
    
    # 2. Get a property and room
    prop = Property.objects.first()
    if not prop:
        print("No property found in DB. Please run populate_db.py first.")
        return
        
    room = prop.rooms.first()
    if not room:
        print(f"No rooms found for property {prop.name}")
        return

    # 3. Simulate Razorpay verification call
    order_id = "order_test_123"
    payment_id = "pay_test_456"
    
    # Generate valid signature
    msg = f"{order_id}|{payment_id}"
    secret = settings.RAZORPAY_KEY_SECRET
    signature = hmac.new(
        secret.encode('utf-8'),
        msg.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    url = reverse('verify_razorpay_payment')
    data = {
        "razorpay_order_id": order_id,
        "razorpay_payment_id": payment_id,
        "razorpay_signature": signature,
        "property_id": str(prop.id),
        "room_id": str(room.id),
        "amount": room.price
    }
    
    print(f"Testing verification for User: {user.email}, Property: {prop.name}, Room: {room.name}")
    response = client.post(url, data, format='json')
    
    if response.status_code == 200:
        print("Verification SUCCESS")
        print("Response data:", response.data)
        
        # 4. Verify booking exists in DB
        booking = Booking.objects.filter(payment_id=payment_id).first()
        if booking:
            print(f"Verified: Booking {booking.id} created successfully!")
            print(f"Booking Details: Property={booking.property.name}, Room={booking.room.name}, User={booking.user.email}, Amount={booking.amount}")
        else:
            print("FAILED: Booking not found in database!")
    else:
        print(f"Verification FAILED with status {response.status_code}")
        print("Error details:", response.data)

if __name__ == "__main__":
    test_booking_creation()
