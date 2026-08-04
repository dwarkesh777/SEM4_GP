import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Review

review = Review.objects.filter(id='69ac1c7715543d383d85685f').first()
if review:
    print(f"Deleting review ID: {review.id}, Comment: {review.comment}")
    review.delete()
else:
    print("Not found.")
