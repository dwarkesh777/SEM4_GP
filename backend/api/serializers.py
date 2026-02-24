from rest_framework import serializers
from .models import Property, Amenity, Room, Review, PropertyImage

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
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
        read_only=True,
        slug_field='name'
    )
    images = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='image_path'
    )
    rooms = RoomSerializer(many=True, read_only=True)
    reviews_list = ReviewSerializer(many=True, read_only=True)
    
    image = serializers.CharField(source='main_image')
    reviews = serializers.IntegerField(source='reviews_count')
    originalPrice = serializers.IntegerField(source='original_price', required=False)

    class Meta:
        model = Property
        fields = [
            'id', 'image', 'images', 'video_url', 'name', 'location', 'type', 'gender', 
            'rating', 'reviews', 'price', 'originalPrice', 'amenities', 
            'description', 'rooms', 'reviews_list', 'address', 'phone', 'email'
        ]
