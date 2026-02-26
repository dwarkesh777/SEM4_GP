from rest_framework import serializers
from .booking_models import Booking, Payment
from django.contrib.auth import get_user_model

User = get_user_model()

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'property_id', 'property_name', 'room_name', 'room_price',
            'check_in_date', 'check_out_date', 'guest_name', 'guest_email', 
            'guest_phone', 'guest_address', 'special_requests', 'total_amount',
            'status', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Set the user from the request context
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

class PaymentSerializer(serializers.ModelSerializer):
    booking_details = BookingSerializer(source='booking', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'booking_details', 'razorpay_order_id', 'razorpay_payment_id',
            'razorpay_signature', 'amount', 'currency', 'status', 'receipt_url',
            'receipt_generated_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'razorpay_payment_id', 'razorpay_signature', 'receipt_url', 'receipt_generated_at', 'created_at', 'updated_at']

class BookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating bookings with Razorpay order"""
    
    class Meta:
        model = Booking
        fields = [
            'property_id', 'property_name', 'room_name', 'room_price',
            'check_in_date', 'check_out_date', 'guest_name', 'guest_email', 
            'guest_phone', 'guest_address', 'special_requests', 'total_amount'
        ]

    def create(self, validated_data):
        import razorpay
        from django.conf import settings
        
        user = self.context['request'].user
        validated_data['user'] = user
        
        # Create Razorpay order
        client = razorpay.Client(
            auth=('rzp_live_SKk9PuXXC5dsm6', 'v7E2TU5WJt5Ws5a8xdzA9yTs')
        )
        
        order_data = {
            'amount': validated_data['total_amount'] * 100,  # Convert to paise
            'currency': 'INR',
            'receipt': f"booking_{user.id}_{int(validated_data['total_amount'])}",
            'notes': {
                'property_name': validated_data['property_name'],
                'guest_name': validated_data['guest_name'],
                'guest_email': validated_data['guest_email'],
            }
        }
        
        try:
            razorpay_order = client.order.create(data=order_data)
            validated_data['razorpay_order_id'] = razorpay_order['id']
        except Exception as e:
            print(f"Razorpay order creation error: {e}")
            # Still create booking even if Razorpay fails
            pass
        
        return super().create(validated_data)

class PaymentVerifySerializer(serializers.Serializer):
    """Serializer for verifying Razorpay payments"""
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()
    booking_id = serializers.UUIDField()

    def validate(self, attrs):
        import razorpay
        import hashlib
        import hmac
        
        booking_id = attrs['booking_id']
        
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            raise serializers.ValidationError("Invalid booking ID")
        
        # Verify Razorpay signature
        client = razorpay.Client(
            auth=('rzp_live_SKk9PuXXC5dsm6', 'v7E2TU5WJt5Ws5a8xdzA9yTs')
        )
        
        try:
            # Verify signature
            params_dict = {
                'razorpay_order_id': attrs['razorpay_order_id'],
                'razorpay_payment_id': attrs['razorpay_payment_id'],
                'razorpay_signature': attrs['razorpay_signature']
            }
            
            client.utility.verify_payment_signature(params_dict)
            
            # Update booking with payment details
            booking.razorpay_payment_id = attrs['razorpay_payment_id']
            booking.razorpay_signature = attrs['razorpay_signature']
            booking.status = 'confirmed'
            booking.save()
            
            # Create payment record
            payment, created = Payment.objects.get_or_create(
                booking=booking,
                defaults={
                    'razorpay_order_id': attrs['razorpay_order_id'],
                    'razorpay_payment_id': attrs['razorpay_payment_id'],
                    'razorpay_signature': attrs['razorpay_signature'],
                    'amount': booking.total_amount * 100,
                    'currency': 'INR',
                    'status': 'completed'
                }
            )
            
            if not created:
                payment.razorpay_payment_id = attrs['razorpay_payment_id']
                payment.razorpay_signature = attrs['razorpay_signature']
                payment.status = 'completed'
                payment.save()
            
            attrs['booking'] = booking
            attrs['payment'] = payment
            
        except razorpay.errors.SignatureVerificationError:
            raise serializers.ValidationError("Invalid payment signature")
        except Exception as e:
            raise serializers.ValidationError(f"Payment verification failed: {str(e)}")
        
        return attrs
