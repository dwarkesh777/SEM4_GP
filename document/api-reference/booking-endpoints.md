---
label: Booking & Payment API
icon: credit-card
order: 880
---

# 💳 Booking & Payment API Reference

Endpoints for creating room bookings, verifying online payments via Razorpay, updating payment schedules, and cancelling bookings.

---

## 1. Create Room Booking

```http
POST /api/bookings/
Headers: Authorization: Bearer <student_access_token>
```

**Request Body:**
```json
{
  "property_id": 1,
  "room_id": 101,
  "customer_name": "John Doe",
  "customer_email": "john@gmail.com",
  "customer_phone": "+919876543210"
}
```

**Response (201 Created):**
```json
{
  "id": 88,
  "status": "Pending",
  "razorpay_order_id": "order_N1X8aBc123",
  "amount": 850000,
  "currency": "INR"
}
```

---

## 2. Verify Razorpay Payment

```http
POST /api/bookings/{id}/verify_payment/
Headers: Authorization: Bearer <student_access_token>
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_N1X8aBc123",
  "razorpay_payment_id": "pay_N1X8zXy999",
  "razorpay_signature": "4f9d2a1b7e..."
}
```

**Response (200 OK):**
```json
{
  "message": "Payment verified successfully",
  "booking_status": "Confirmed"
}
```

---

## 3. Update Payment Date / Mark Paid (Owner Only)

```http
PATCH /api/bookings/{id}/update_payment_date/
Headers: Authorization: Bearer <owner_access_token>
```

**Request Body:**
```json
{
  "payment_date": "2026-09-07",
  "send_receipt": true
}
```

---

## 4. Cancel Booking / Remove Resident (Owner Only)

```http
POST /api/bookings/{id}/cancel/
Headers: Authorization: Bearer <owner_access_token>
```

**Response (200 OK):**
```json
{
  "message": "Booking cancelled and bed returned to room inventory"
}
```
