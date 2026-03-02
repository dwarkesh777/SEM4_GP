from rest_framework import serializers
from .models import Property, Amenity, Room, Review, PropertyImage, Appliance, Booking, Enquiry, Wishlist


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['name']


class ApplianceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appliance
        fields = ['name']


class PropertyImageSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']


class RoomSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = Room
        fields = ['id', 'name', 'beds', 'occupancy', 'price', 'is_ac', 'available']


class ReviewSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = Review
        fields = ['id', 'name', 'rating', 'date', 'comment']


class EmptyStringFloatField(serializers.FloatField):
    """FloatField that safely treats empty string as None."""
    def to_internal_value(self, data):
        if data == '' or data is None:
            if self.allow_null:
                return None
            self.fail('null')
        return super().to_internal_value(data)


class EmptyStringIntField(serializers.IntegerField):
    """IntegerField that safely treats empty string as None."""
    def to_internal_value(self, data):
        if data == '' or data is None:
            if self.allow_null:
                return None
            self.fail('null')
        return super().to_internal_value(data)


class PropertySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    amenities = serializers.SlugRelatedField(
        many=True,
        queryset=Amenity.objects.all(),
        slug_field='name',
        required=False
    )
    appliances = serializers.SlugRelatedField(
        many=True,
        queryset=Appliance.objects.all(),
        slug_field='name',
        required=False
    )
    images = PropertyImageSerializer(many=True, read_only=True)

    # rooms is read_only: actual room creation handled via rooms_json in create()
    # This avoids DRF trying to validate nested rooms from flat FormData
    rooms = RoomSerializer(many=True, read_only=True)

    reviews_list = ReviewSerializer(many=True, read_only=True)
    main_image = serializers.ImageField(required=False, allow_null=True)
    video = serializers.FileField(required=False, allow_null=True)
    reviews = serializers.IntegerField(source='reviews_count', read_only=True)

    # Safe numeric fields: empty string "" from FormData becomes None, not a validation error
    latitude = EmptyStringFloatField(required=False, allow_null=True)
    longitude = EmptyStringFloatField(required=False, allow_null=True)
    originalPrice = EmptyStringIntField(source='original_price', required=False, allow_null=True)

    # price is required but use EmptyStringIntField so blank string gives a clear error
    price = EmptyStringIntField()
    owner = serializers.ReadOnlyField(source='owner.email')

    # NOTE: uploaded_images intentionally NOT declared as a DRF field.
    # DRF's ListField(child=ImageField()) is incompatible with MultiPartParser
    # because files live in request.FILES, not request.data. Read directly in create().

    class Meta:
        model = Property
        fields = [
            'id', 'main_image', 'images', 'video', 'name', 'city', 'location',
            'latitude', 'longitude', 'type', 'gender', 'rating', 'reviews',
            'price', 'originalPrice', 'amenities', 'appliances',
            'description', 'rooms', 'reviews_list', 'address', 'phone', 'email', 'owner',
        ]

    def create(self, validated_data):
        import json
        import logging
        logger = logging.getLogger(__name__)

        validated_data.pop('rooms', [])

        rooms_json = self.context['request'].data.get('rooms_json')
        if rooms_json:
            try:
                rooms_data = json.loads(rooms_json)
            except Exception:
                rooms_data = []
        else:
            rooms_data = []

        amenities_data = validated_data.pop('amenities', [])
        appliances_data = validated_data.pop('appliances', [])

        # Read gallery images directly from request.FILES
        uploaded_images = self.context['request'].FILES.getlist('uploaded_images')

        # Amenities/appliances from FormData strings using get_or_create to avoid DoesNotExist
        if not amenities_data:
            raw = self.context['request'].data.getlist('amenities')
            amenities_data = [Amenity.objects.get_or_create(name=n)[0] for n in raw if n]

        if not appliances_data:
            raw = self.context['request'].data.getlist('appliances')
            appliances_data = [Appliance.objects.get_or_create(name=n)[0] for n in raw if n]

        try:
            property_obj = Property.objects.create(**validated_data)
        except Exception as e:
            logger.error(f"Error creating property: {e}")
            raise serializers.ValidationError({"error": str(e)})

        if amenities_data:
            property_obj.amenities.set(amenities_data)
        if appliances_data:
            property_obj.appliances.set(appliances_data)

        from .models import Room, PropertyImage
        for room_data in rooms_data:
            if isinstance(room_data, dict) and room_data.get('name') and room_data.get('price') is not None:
                try:
                    room_fields = {
                        k: v for k, v in room_data.items()
                        if k in ['name', 'beds', 'occupancy', 'price', 'is_ac', 'available']
                    }
                    Room.objects.create(property=property_obj, **room_fields)
                except Exception as e:
                    logger.error(f"Error creating room: {e}")

        for img in uploaded_images:
            PropertyImage.objects.create(property=property_obj, image=img)

        return property_obj


class BookingSerializer(serializers.ModelSerializer):
    property_name = serializers.ReadOnlyField(source='property.name')
    room_name = serializers.ReadOnlyField(source='room.name')
    property_image = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'property', 'property_name', 'property_image', 
            'room', 'room_name', 'status', 'created_at',
            'payment_id', 'razorpay_order_id', 'amount',
            'customer_name', 'customer_phone', 'customer_email', 'customer_age'
        ]
        read_only_fields = ['user', 'status', 'created_at']

    def get_property_image(self, obj):
        if obj.property.main_image:
            # Check if request exists in context (it should if called via ViewSet)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.property.main_image.url)
            return obj.property.main_image.url
        return None


class EnquirySerializer(serializers.ModelSerializer):
    property_name = serializers.ReadOnlyField(source='property.name')
    property_image = serializers.SerializerMethodField()

    class Meta:
        model = Enquiry
        fields = ['id', 'user', 'property', 'property_name', 'property_image', 'name', 'phone', 'message', 'created_at']
        read_only_fields = ['user', 'created_at']

    def get_property_image(self, obj):
        if obj.property.main_image:
            return self.context['request'].build_absolute_uri(obj.property.main_image.url)
        return None


class WishlistSerializer(serializers.ModelSerializer):
    property_details = PropertySerializer(source='property', read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'property', 'property_details', 'created_at']
        read_only_fields = ['user', 'created_at']