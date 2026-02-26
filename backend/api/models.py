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
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_owner = models.BooleanField(default=False)
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

    def __str__(self):
        return self.name

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='properties/extra/', null=True, blank=True)

class Room(models.Model):
    property = models.ForeignKey(Property, related_name='rooms', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    beds = models.IntegerField(default=1)
    occupancy = models.CharField(max_length=100)
    price = models.IntegerField()
    available = models.BooleanField(default=True)

class Review(models.Model):
    property = models.ForeignKey(Property, related_name='reviews_list', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.full_name} - {self.property.name} ({self.rating}★)"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='bookings')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

class Enquiry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enquiries')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='enquiries')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'property')
