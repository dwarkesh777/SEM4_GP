import django.db.models.deletion
import django_mongodb_backend.fields
from django.conf import settings
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_room_available_beds'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='phone_number',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', django_mongodb_backend.fields.ObjectIdAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Confirmed', 'Confirmed'), ('Cancelled', 'Cancelled')], default='Pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='api.property')),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='api.room')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Enquiry',
            fields=[
                ('id', django_mongodb_backend.fields.ObjectIdAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enquiries', to='api.property')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enquiries', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Wishlist',
            fields=[
                ('id', django_mongodb_backend.fields.ObjectIdAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='wishlisted_by', to='api.property')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='wishlist', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'property')},
            },
        ),
    ]
