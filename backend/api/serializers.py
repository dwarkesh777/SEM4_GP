from rest_framework import serializers
from .models import Property, Amenity, Room, Review, PropertyImage, Appliance

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
        fields = ['id', 'name', 'beds', 'occupancy', 'price', 'available']

class ReviewSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = Review
        fields = ['id', 'name', 'rating', 'date', 'comment']

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
    rooms = RoomSerializer(many=True, required=False)
    reviews_list = ReviewSerializer(many=True, read_only=True)
    
    main_image = serializers.ImageField(required=False, allow_null=True)
    video = serializers.FileField(required=False, allow_null=True)
    reviews = serializers.IntegerField(source='reviews_count', read_only=True)
    originalPrice = serializers.IntegerField(source='original_price', required=False, allow_null=True)
    owner = serializers.ReadOnlyField(source='owner.email')

    # For multiple uploads
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Property
        fields = [
            'id', 'main_image', 'images', 'video', 'name', 'city', 'location', 
            'latitude', 'longitude', 'type', 'gender', 'rating', 'reviews', 
            'price', 'originalPrice', 'amenities', 'appliances',
            'description', 'rooms', 'reviews_list', 'address', 'phone', 'email', 'owner',
            'uploaded_images'
        ]

    def create(self, validated_data):
        import json
        import logging
        logger = logging.getLogger(__name__)

        # Always pop 'rooms' to avoid passing it to Property.objects.create
        validated_data.pop('rooms', [])

        # Handle rooms from either nested data or JSON string (from FormData)
        rooms_json = self.context['request'].data.get('rooms_json')
        if rooms_json:
            try:
                rooms_data = json.loads(rooms_json)
            except Exception:
                rooms_data = []
        else:
            # Re-fetch if needed, though usually rooms_json is preferred for FormData
            rooms_data = self.initial_data.get('rooms', [])

        amenities_data = validated_data.pop('amenities', [])
        appliances_data = validated_data.pop('appliances', [])
        uploaded_images = validated_data.pop('uploaded_images', [])
        
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
            # Ensure required fields are present and not None
            if isinstance(room_data, dict) and room_data.get('name') and room_data.get('price') is not None:
                try:
                    # Filter out keys not in the Room model
                    room_fields = {k: v for k, v in room_data.items() if k in ['name', 'beds', 'occupancy', 'price', 'available']}
                    Room.objects.create(property=property_obj, **room_fields)
                except Exception as e:
                    logger.error(f"Error creating room: {e}")

        for img in uploaded_images:
            PropertyImage.objects.create(property=property_obj, image=img)
            
        return property_obj
