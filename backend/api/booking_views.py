from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.conf import settings
import razorpay
import json
from datetime import datetime

from .booking_models import Booking, Payment
from .booking_serializers import (
    BookingSerializer, 
    PaymentSerializer, 
    BookingCreateSerializer, 
    PaymentVerifySerializer
)

class BookingCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Create a new booking and Razorpay order"""
        serializer = BookingCreateSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            try:
                booking = serializer.save()
                
                # Return booking details with Razorpay order info
                response_data = {
                    'id': str(booking.id),
                    'property_name': booking.property_name,
                    'room_name': booking.room_name,
                    'room_price': booking.room_price,
                    'check_in_date': booking.check_in_date,
                    'check_out_date': booking.check_out_date,
                    'guest_info': {
                        'name': booking.guest_name,
                        'email': booking.guest_email,
                        'phone': booking.guest_phone,
                        'address': booking.guest_address,
                    },
                    'special_requests': booking.special_requests,
                    'total_amount': booking.total_amount,
                    'status': booking.status,
                    'razorpay_order_id': booking.razorpay_order_id,
                    'created_at': booking.created_at,
                }
                
                return Response(response_data, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                return Response(
                    {'error': f'Failed to create booking: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentVerifyView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Verify Razorpay payment and update booking status"""
        serializer = PaymentVerifySerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                booking = serializer.validated_data['booking']
                payment = serializer.validated_data['payment']
                
                # Generate receipt URL (you can implement PDF generation here)
                receipt_url = f"/api/bookings/{booking.id}/receipt/"
                
                # Update payment with receipt URL
                payment.receipt_url = request.build_absolute_uri(receipt_url)
                payment.receipt_generated_at = datetime.now()
                payment.save()
                
                response_data = {
                    'booking_id': str(booking.id),
                    'payment_id': payment.razorpay_payment_id,
                    'amount': booking.total_amount,
                    'status': 'completed',
                    'receipt_url': payment.receipt_url,
                    'message': 'Payment verified successfully'
                }
                
                return Response(response_data, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response(
                    {'error': f'Payment verification failed: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserBookingsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get all bookings for the authenticated user"""
        bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
        serializer = BookingSerializer(bookings, many=True)
        
        # Format the response for frontend
        formatted_bookings = []
        for booking in bookings.data:
            formatted_booking = {
                'id': booking['id'],
                'property_name': booking['property_name'],
                'room_name': booking['room_name'],
                'status': booking['status'].replace('_', ' ').title(),
                'date': booking['check_in_date'],
                'price': booking['total_amount'],
                'created_at': booking['created_at'],
                'payment_status': 'completed' if booking.get('razorpay_payment_id') else 'pending'
            }
            formatted_bookings.append(formatted_booking)
        
        return Response(formatted_bookings, status=status.HTTP_200_OK)

class BookingReceiptView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, booking_id):
        """Generate and return PDF receipt for a booking"""
        try:
            booking = get_object_or_404(Booking, id=booking_id, user=request.user)
            
            # Check if payment exists and is completed
            try:
                payment = booking.payment
                if payment.status != 'completed':
                    return Response(
                        {'error': 'Payment not completed for this booking'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Payment.DoesNotExist:
                return Response(
                    {'error': 'No payment found for this booking'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Generate PDF receipt
            pdf_content = self.generate_pdf_receipt(booking, payment)
            
            # Return PDF as response
            response = HttpResponse(pdf_content, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="receipt_{booking.id}.pdf"'
            return response
            
        except Exception as e:
            return Response(
                {'error': f'Failed to generate receipt: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def generate_pdf_receipt(self, booking, payment):
        """Generate PDF receipt content"""
        try:
            from reportlab.pdfgen import canvas
            from reportlab.lib.pagesizes import letter
            from reportlab.lib.units import inch
            from io import BytesIO
            
            buffer = BytesIO()
            p = canvas.Canvas(buffer, pagesize=letter)
            
            # Set up the PDF
            width, height = letter
            
            # Header
            p.setFont("Helvetica-Bold", 20)
            p.drawString(50, height - 50, "PAYMENT RECEIPT")
            
            # Company info
            p.setFont("Helvetica", 12)
            p.drawString(50, height - 80, "BedBuddy - Premium Student Living")
            p.drawString(50, height - 100, "Ahmedabad, Gujarat, India")
            
            # Booking details
            p.setFont("Helvetica-Bold", 14)
            p.drawString(50, height - 140, "Booking Details")
            
            p.setFont("Helvetica", 11)
            y_position = height - 160
            line_height = 20
            
            details = [
                f"Booking ID: {booking.id}",
                f"Property: {booking.property_name}",
                f"Room Type: {booking.room_name}",
                f"Guest Name: {booking.guest_name}",
                f"Email: {booking.guest_email}",
                f"Phone: {booking.guest_phone}",
                f"Check-in Date: {booking.check_in_date}",
                f"Amount Paid: ₹{booking.total_amount}",
                f"Payment ID: {payment.razorpay_payment_id}",
                f"Payment Date: {payment.created_at.strftime('%Y-%m-%d %H:%M:%S')}",
            ]
            
            for detail in details:
                p.drawString(70, y_position, detail)
                y_position -= line_height
            
            # Footer
            p.setFont("Helvetica-Oblique", 10)
            p.drawString(50, 50, "This is a computer-generated receipt. No signature required.")
            
            p.showPage()
            p.save()
            
            buffer.seek(0)
            return buffer.getvalue()
            
        except ImportError:
            # If reportlab is not installed, return a simple text receipt
            receipt_text = f"""
PAYMENT RECEIPT
================

Booking Details:
- Booking ID: {booking.id}
- Property: {booking.property_name}
- Room Type: {booking.room_name}
- Guest Name: {booking.guest_name}
- Email: {booking.guest_email}
- Phone: {booking.guest_phone}
- Check-in Date: {booking.check_in_date}

Payment Details:
- Amount Paid: ₹{booking.total_amount}
- Payment ID: {payment.razorpay_payment_id}
- Payment Date: {payment.created_at.strftime('%Y-%m-%d %H:%M:%S')}

This is a computer-generated receipt. No signature required.
            """
            
            return receipt_text.encode('utf-8')

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def booking_stats(request):
    """Get booking statistics for the user"""
    try:
        bookings = Booking.objects.filter(user=request.user)
        
        total_bookings = bookings.count()
        confirmed_bookings = bookings.filter(status='confirmed').count()
        pending_bookings = bookings.filter(status='pending_payment').count()
        cancelled_bookings = bookings.filter(status='cancelled').count()
        
        stats = {
            'total_bookings': total_bookings,
            'confirmed_bookings': confirmed_bookings,
            'pending_bookings': pending_bookings,
            'cancelled_bookings': cancelled_bookings,
        }
        
        return Response(stats, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch booking stats: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
