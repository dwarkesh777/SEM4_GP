from django.db import models

class Amenity(models.Model):
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

    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
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
    main_image = models.CharField(max_length=500) # Storing asset path/name for now
    amenities = models.ManyToManyField(Amenity, related_name='properties')

    def __str__(self):
        return self.name

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name='images', on_delete=models.CASCADE)
    image_path = models.CharField(max_length=500)

class Room(models.Model):
    property = models.ForeignKey(Property, related_name='rooms', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    occupancy = models.CharField(max_length=100)
    price = models.IntegerField()
    available = models.BooleanField(default=True)

class Review(models.Model):
    property = models.ForeignKey(Property, related_name='reviews_list', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    rating = models.IntegerField()
    date = models.DateField()
    comment = models.TextField()
