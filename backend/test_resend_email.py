import os
import django
from django.core.mail import send_mail
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

def test_email():
    print(f"Using Backend: {settings.EMAIL_BACKEND}")
    print(f"From Email: {settings.DEFAULT_FROM_EMAIL}")
    
    subject = 'Resend Test Email'
    message = 'This is a test email from BedBuddy using Resend.'
    recipient_list = ['savaliyadwarkesh95@gmail.com'] # Using the Gmail from .env as a likely valid recipient
    
    try:
        sent = send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list)
        if sent:
            print("Successfully sent test email!")
        else:
            print("Failed to send test email (returned 0).")
    except Exception as e:
        print(f"Error sending email: {e}")

if __name__ == '__main__':
    test_email()
