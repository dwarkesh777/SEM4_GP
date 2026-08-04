from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django_mongodb_backend.fields import ObjectIdField
import uuid

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('is_owner', False)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_owner = models.BooleanField(default=False)
    face_photo = models.URLField(max_length=500, null=True, blank=True)
    business_name = models.CharField(max_length=255, null=True, blank=True)
    pan_number = models.CharField(max_length=20, null=True, blank=True)
    aadhar_number = models.CharField(max_length=20, null=True, blank=True)
    bank_account = models.CharField(max_length=50, null=True, blank=True)
    ifsc_code = models.CharField(max_length=20, null=True, blank=True)
    otp_code = models.CharField(max_length=6, null=True, blank=True)
    otp_expiry = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.email

class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Appliance(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Property(models.Model):
    PROPERTY_TYPES = [
        ('Hostel', 'Hostel'),
        ('PG', 'PG'),
    ]
    GENDER_CHOICES = [
        ('Boys', 'Boys'),
        ('Girls', 'Girls'),
        ('Co-ed', 'Co-ed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, related_name='properties', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100, default="Ahmedabad")
    location = models.CharField(max_length=200)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    type = models.CharField(max_length=20, choices=PROPERTY_TYPES)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    rating = models.FloatField(default=0.0)
    reviews_count = models.IntegerField(default=0)
    price = models.IntegerField()
    original_price = models.IntegerField(null=True, blank=True)
    description = models.TextField()
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    main_image = models.ImageField(upload_to='properties/main/', null=True, blank=True)
    video = models.FileField(upload_to='properties/videos/', null=True, blank=True)
    amenities = models.ManyToManyField(Amenity, related_name='properties', blank=True)
    appliances = models.ManyToManyField(Appliance, related_name='properties', blank=True)
    is_verified = models.BooleanField(default=None, null=True, blank=True)  # None=pending, True=approved, False=rejected
    created_at = models.DateTimeField(auto_now_add=True, db_index=True, null=True, blank=True)

    def __str__(self):
        return self.name

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='properties/extra/', null=True, blank=True)

class Room(models.Model):
    property = models.ForeignKey(Property, related_name='rooms', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    beds = models.IntegerField(default=1)
    total_beds = models.IntegerField(default=20)
    occupancy = models.CharField(max_length=100)
    price = models.IntegerField()
    is_ac = models.CharField(max_length=20, default='Non-AC')
    available = models.BooleanField(default=True)

    def get_booked_beds(self):
        return self.bookings.filter(status='Confirmed').count()

    def get_available_beds(self):
        return max(0, self.total_beds - self.get_booked_beds())

class Review(models.Model):
    property = models.ForeignKey(Property, related_name='reviews_list', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='reviews', on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=100)
    rating = models.IntegerField()
    date = models.DateField(auto_now_add=True)
    comment = models.TextField()
    image = models.ImageField(upload_to='reviews/', null=True, blank=True)

class Booking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='bookings')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Confirmed')
    created_at = models.DateTimeField(auto_now_add=True)
    # Payment details
    payment_date = models.DateTimeField(null=True, blank=True)
    payment_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_order_id = models.CharField(max_length=100, null=True, blank=True)
    amount = models.IntegerField(null=True, blank=True)
    # Customer details (stored at booking time)
    customer_name = models.CharField(max_length=255, null=True, blank=True)
    customer_phone = models.CharField(max_length=20, null=True, blank=True)
    customer_email = models.EmailField(null=True, blank=True)
    customer_age = models.IntegerField(null=True, blank=True)

class Enquiry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='enquiries')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='enquiries')
    name = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'property')