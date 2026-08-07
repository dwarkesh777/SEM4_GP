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
    booked_beds = serializers.SerializerMethodField()
    available_beds = serializers.SerializerMethodField()

    def get_booked_beds(self, obj):
        # Use prefetched confirmed_bookings list (set by Prefetch to_attr in views.py)
        # to avoid an extra DB query per room.
        if hasattr(obj, 'confirmed_bookings'):
            return len(obj.confirmed_bookings)
        return obj.get_booked_beds()

    def get_available_beds(self, obj):
        if hasattr(obj, 'confirmed_bookings'):
            return max(0, obj.total_beds - len(obj.confirmed_bookings))
        return obj.get_available_beds()

    class Meta:
        model = Room
        fields = ['id', 'name', 'beds', 'total_beds', 'booked_beds', 'available_beds', 'occupancy', 'price', 'is_ac', 'available']


class ReviewSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    user = serializers.ReadOnlyField(source='user.full_name')
    property_name = serializers.ReadOnlyField(source='property.name')

    class Meta:
        model = Review
        fields = ['id', 'user', 'name', 'rating', 'date', 'comment', 'property', 'image', 'property_name']
        read_only_fields = ['id', 'user', 'date']
        extra_kwargs = {
            'name': {
                'required': False,
                'allow_blank': True,
                'allow_null': True
            }
        }


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
        try:
            # Safely convert float strings (like "5000.0" or "5000.00") to integer
            return int(float(data))
        except (ValueError, TypeError):
            pass
        return super().to_internal_value(data)


class PropertySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    # amenities/appliances are read_only here — writing is handled in create() via get_or_create
    # This avoids SlugRelatedField validation failures when names don't exist in DB yet
    amenities = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )
    appliances = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
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
    owner_name = serializers.ReadOnlyField(source='owner.full_name')
    owner_photo = serializers.ReadOnlyField(source='owner.face_photo')
    owner_phone = serializers.ReadOnlyField(source='owner.phone_number')
    distance = serializers.SerializerMethodField()

    # NOTE: uploaded_images intentionally NOT declared as a DRF field.
    # DRF's ListField(child=ImageField()) is incompatible with MultiPartParser
    # because files live in request.FILES, not request.data. Read directly in create().

    class Meta:
        model = Property
        fields = [
            'id', 'main_image', 'images', 'video', 'name', 'city', 'location',
            'latitude', 'longitude', 'type', 'gender', 'rating', 'reviews',
            'price', 'originalPrice', 'amenities', 'appliances',
            'description', 'rooms', 'reviews_list', 'address', 'phone', 'email', 'owner', 'owner_name', 'owner_photo', 'owner_phone',
            'distance', 'is_verified', 'created_at',
        ]

    def get_distance(self, obj):
        # The distance is calculated in get_queryset and attached to the object
        return getattr(obj, 'distance', None)

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
                        if k in ['name', 'beds', 'total_beds', 'occupancy', 'price', 'is_ac', 'available']
                    }
                    Room.objects.create(property=property_obj, **room_fields)
                except Exception as e:
                    logger.error(f"Error creating room: {e}")

        if uploaded_images:
            from concurrent.futures import ThreadPoolExecutor

            def save_single_image(img):
                try:
                    PropertyImage.objects.create(property=property_obj, image=img)
                except Exception as e:
                    logger.error(f"Error saving gallery image to Cloudinary: {e}")

            # Upload up to 5 images simultaneously in parallel threads
            max_threads = min(5, len(uploaded_images))
            with ThreadPoolExecutor(max_workers=max_threads) as executor:
                list(executor.map(save_single_image, uploaded_images))

        return property_obj

    def update(self, instance, validated_data):
        import json
        import logging
        logger = logging.getLogger(__name__)

        validated_data.pop('rooms', None)
        validated_data.pop('amenities', None)
        validated_data.pop('appliances', None)

        # Update basic fields on instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        request = self.context.get('request')
        if not request:
            return instance

        # 1. Update Amenities
        raw_amenities = request.data.getlist('amenities')
        if raw_amenities:
            amenities_objs = [Amenity.objects.get_or_create(name=n)[0] for n in raw_amenities if n]
            instance.amenities.set(amenities_objs)

        # 2. Update Appliances
        raw_appliances = request.data.getlist('appliances')
        if raw_appliances:
            appliances_objs = [Appliance.objects.get_or_create(name=n)[0] for n in raw_appliances if n]
            instance.appliances.set(appliances_objs)

        # 3. Update Rooms
        rooms_json = request.data.get('rooms_json')
        if rooms_json:
            try:
                rooms_data = json.loads(rooms_json)
            except Exception as e:
                logger.error(f"Error parsing rooms_json during update: {e}")
                rooms_data = None

            if isinstance(rooms_data, list):
                from .models import Room
                processed_room_ids = []

                for room_data in rooms_data:
                    if isinstance(room_data, dict) and room_data.get('name') and room_data.get('price') is not None:
                        try:
                            room_id = room_data.get('id')
                            name = str(room_data.get('name', 'Room')).strip()
                            beds = int(room_data.get('beds', 1))
                            total_beds = int(room_data.get('total_beds', 20))
                            occupancy = str(room_data.get('occupancy', 'Single'))
                            price = int(float(room_data.get('price', 0)))
                            is_ac = str(room_data.get('is_ac', 'Non-AC'))
                            available = bool(room_data.get('available', True))

                            room_obj = None
                            if room_id:
                                try:
                                    room_obj = Room.objects.get(id=room_id, property=instance)
                                    room_obj.name = name
                                    room_obj.beds = beds
                                    room_obj.total_beds = total_beds
                                    room_obj.occupancy = occupancy
                                    room_obj.price = price
                                    room_obj.is_ac = is_ac
                                    room_obj.available = available
                                    room_obj.save()
                                except (Room.DoesNotExist, ValueError):
                                    room_obj = Room.objects.create(
                                        property=instance,
                                        name=name,
                                        beds=beds,
                                        total_beds=total_beds,
                                        occupancy=occupancy,
                                        price=price,
                                        is_ac=is_ac,
                                        available=available
                                    )
                            else:
                                room_obj = Room.objects.create(
                                    property=instance,
                                    name=name,
                                    beds=beds,
                                    total_beds=total_beds,
                                    occupancy=occupancy,
                                    price=price,
                                    is_ac=is_ac,
                                    available=available
                                )

                            if room_obj:
                                processed_room_ids.append(room_obj.id)

                        except Exception as e:
                            logger.error(f"Error updating/creating room during property edit: {e}")

                if processed_room_ids:
                    instance.rooms.exclude(id__in=processed_room_ids).delete()

        # 4. Save uploaded gallery images if any
        uploaded_images = request.FILES.getlist('uploaded_images')
        if uploaded_images:
            from .models import PropertyImage
            for img in uploaded_images:
                try:
                    PropertyImage.objects.create(property=instance, image=img)
                except Exception as e:
                    logger.error(f"Error saving uploaded gallery image during edit: {e}")

        return instance


class BookingSerializer(serializers.ModelSerializer):
    property_name = serializers.CharField(source='property.name', read_only=True)
    room_name = serializers.CharField(source='room.name', read_only=True)
    property_image = serializers.SerializerMethodField()
    property_location = serializers.CharField(source='property.location', read_only=True)
    property_city = serializers.CharField(source='property.city', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'property_name', 'property_image', 
            'room_name', 'status', 'created_at', 'payment_date',
            'payment_id', 'razorpay_order_id', 'amount',
            'customer_name', 'customer_phone', 'customer_email', 'customer_age',
            'property_location', 'property_city'
        ]
        read_only_fields = ['id', 'property_name', 'room_name', 'property_image', 'property_location', 'property_city', 'created_at']

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