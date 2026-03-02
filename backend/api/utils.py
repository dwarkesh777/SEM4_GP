import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_booking_pdf(booking):
    """
    Generates a PDF receipt for a booking.
    Returns: BytesIO object containing the PDF data.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    title_style.alignment = 1 # Center
    
    # Header
    elements.append(Paragraph("NestNode Booking Receipt", title_style))
    elements.append(Spacer(1, 0.2 * inch))
    
    # Booking Info
    booking_info = [
        ["Booking ID", str(booking.id)],
        ["Order ID", booking.razorpay_order_id],
        ["Date", booking.created_at.strftime("%Y-%m-%d %H:%M:%S")],
        ["Status", booking.status],
    ]
    
    # Customer Info
    customer_info = [
        ["Customer Name", booking.customer_name],
        ["Phone", booking.customer_phone],
        ["Email", booking.customer_email],
    ]
    
    # Property & Room Info
    prop_info = [
        ["Property", booking.property.title],
        ["Room", booking.room.name if booking.room else "N/A"],
        ["Location", booking.property.location if hasattr(booking.property, 'location') else "N/A"],
    ]
    
    # Payment Info
    payment_info = [
        ["Total Amount", f"Rs. {booking.amount}"],
        ["Payment ID", booking.payment_id],
    ]
    
    def create_table(data, title):
        elements.append(Paragraph(f"<b>{title}</b>", styles['Heading3']))
        t = Table(data, colWidths=[2 * inch, 4 * inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.whitesmoke),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 0.2 * inch))

    create_table(booking_info, "Booking Details")
    create_table(customer_info, "Customer Details")
    create_table(prop_info, "Property Information")
    create_table(payment_info, "Payment Summary")
    
    # Footer
    elements.append(Spacer(1, 0.5 * inch))
    footer_style = ParagraphStyle('Footer', parent=styles['Normal'], fontSize=9, textColor=colors.grey)
    elements.append(Paragraph("Thank you for choosing NestNode! If you have any questions, contact us at support@nestnode.com.", footer_style))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
