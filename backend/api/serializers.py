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
    class Meta:
        model = PropertyImage
        fields = ['image_path']

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['name', 'occupancy', 'price', 'available']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['name', 'rating', 'date', 'comment']

class PropertySerializer(serializers.ModelSerializer):
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
    images = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='image_path'
    )
    rooms = RoomSerializer(many=True, required=False)
    reviewsList = ReviewSerializer(many=True, read_only=True)
    
    image = serializers.CharField(source='main_image')
    reviews = serializers.IntegerField(source='reviews_count', read_only=True)
    originalPrice = serializers.IntegerField(source='original_price', required=False, allow_null=True)
    owner = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Property
        fields = [
            'id', 'image', 'images', 'video_url', 'name', 'city', 'location', 
            'latitude', 'longitude', 'type', 'gender', 'rating', 'reviews', 
            'price', 'originalPrice', 'amenities', 'appliances',
            'description', 'rooms', 'reviewsList', 'address', 'phone', 'email', 'owner'
        ]

    def create(self, validated_data):
        rooms_data = validated_data.pop('rooms', [])
        amenities_data = validated_data.pop('amenities', [])
        appliances_data = validated_data.pop('appliances', [])
        
        property_obj = Property.objects.create(**validated_data)
        
        if amenities_data:
            property_obj.amenities.set(amenities_data)
        if appliances_data:
            property_obj.appliances.set(appliances_data)
            
        from .models import Room
        for room_data in rooms_data:
            Room.objects.create(property=property_obj, **room_data)
            
        return property_obj
