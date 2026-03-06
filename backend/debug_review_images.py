#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Review, Property

def debug_review_images():
    print("=== DEBUG: Review Images ===")
    
    # Check total reviews
    total_reviews = Review.objects.count()
    print(f"Total reviews in database: {total_reviews}")
    
    # Check reviews with images
    reviews_with_images = Review.objects.filter(image__isnull=False).exclude(image='')
    print(f"Reviews with images: {reviews_with_images.count()}")
    
    # Check all reviews
    all_reviews = Review.objects.all()
    print(f"\nAll reviews details:")
    for i, review in enumerate(all_reviews):
        print(f"{i+1}. Review ID: {review.id}")
        print(f"   Property: {review.property.name if review.property else 'None'}")
        print(f"   Rating: {review.rating}")
        print(f"   Comment: {review.comment[:50] if review.comment else 'None'}...")
        print(f"   Image: {review.image}")
        print(f"   Image URL: {review.image.url if review.image else 'None'}")
        print(f"   Image exists: {review.image and review.image.name}")
        print("---")
    
    # Check properties
    print(f"\n=== DEBUG: Properties ===")
    properties = Property.objects.all()
    print(f"Total properties: {properties.count()}")
    
    for prop in properties[:5]:  # Show first 5 properties
        print(f"Property: {prop.name}")
        reviews = prop.reviews_list.all()
        print(f"  Reviews count: {reviews.count()}")
        reviews_with_img = reviews.filter(image__isnull=False).exclude(image='')
        print(f"  Reviews with images: {reviews_with_img.count()}")

if __name__ == "__main__":
    debug_review_images()
