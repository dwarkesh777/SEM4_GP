---
label: Database Models & Schemas
icon: database
order: 960
---

# 🗄️ Database Models & Schemas Reference

NestNode uses Django's Object-Relational Mapping (ORM) to define structured data models in `backend/api/models.py`. Below is the complete relational schema reference.

---

## 1. `User` Model (Custom User Model)

Extends Django's `AbstractUser` with extra fields for multi-role support.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | BigAutoField | Primary Key |
| `email` | EmailField (Unique) | User login identifier & contact |
| `full_name` | CharField(255) | Full display name |
| `is_owner` | BooleanField | Flag indicating Property Owner account |
| `is_developer` | BooleanField | Flag indicating Developer account |
| `is_staff` | BooleanField | Flag indicating Django Admin staff |
| `is_superuser` | BooleanField | Flag indicating Superuser privileges |
| `face_photo` | TextField / URL | Cloudinary photo URL or base64 profile picture |
| `business_name` | CharField(255) | Owner business entity name |
| `business_type` | CharField(100) | Enterprise, Individual, PG Operator |
| `address` | TextField | Business address |
| `city` | CharField(100) | Business city |
| `state` | CharField(100) | Business state |
| `pincode` | CharField(20) | Postal code |
| `bio` | TextField | Profile description |
| `phone_number` | CharField(20) | Primary contact number |
| `pan_number` | CharField(20) | Permanent Account Number (Verification) |
| `aadhar_number` | CharField(20) | Aadhaar Identity Number (Verification) |
| `bank_account` | CharField(50) | Payout bank account number |
| `ifsc_code` | CharField(20) | Bank IFSC Code |

---

## 2. `Property` Model

Represents a Hostel or PG listing created by a Property Owner.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | BigAutoField | Primary Key |
| `owner` | ForeignKey(`User`) | Property Owner reference |
| `name` | CharField(255) | Hostel / PG name |
| `type` | CharField(50) | `Hostel`, `PG`, `Flat` |
| `city` | CharField(100) | City location |
| `location` | CharField(255) | Area / Neighborhood |
| `address` | TextField | Full street address |
| `gender` | CharField(20) | `Boys`, `Girls`, `Co-ed` |
| `price` | DecimalField | Starting monthly rent price |
| `original_price` | DecimalField | Original rent price (for discount display) |
| `rating` | FloatField | Average star rating (0.0 to 5.0) |
| `reviews_count` | IntegerField | Total number of reviews |
| `description` | TextField | Detailed property description |
| `latitude` | FloatField | Map coordinate |
| `longitude` | FloatField | Map coordinate |
| `phone` | CharField(20) | Contact telephone |
| `email` | EmailField | Property contact email |
| `is_verified` | BooleanField | Verified property status |
| `main_image` | ImageField / URL | Primary display image |
| `video` | FileField / URL | Property walkthrough video |
| `amenities` | JSONField / ManyToMany | Array of amenity strings (e.g. `wifi`, `ac`) |
| `appliances` | JSONField / ManyToMany | Array of appliance strings |
| `created_at` | DateTimeField | Timestamp of creation |

---

## 3. `Room` Model

Defines room types and bed capacities within a property.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | BigAutoField | Primary Key |
| `property` | ForeignKey(`Property`) | Parent property reference |
| `name` | CharField(100) | Room type name (e.g. "Double Sharing AC") |
| `occupancy` | CharField(50) | `Single`, `Double`, `Triple`, `Four+` |
| `total_beds` | IntegerField | Total beds in room type |
| `available_beds` | IntegerField | Current available beds |
| `price` | DecimalField | Room rent price |
| `is_ac` | CharField(20) | `AC`, `Non-AC` |

---

## 4. `Booking` Model

Tracks room bookings made by students.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | BigAutoField | Primary Key |
| `user` | ForeignKey(`User`) | Booking student reference |
| `property` | ForeignKey(`Property`) | Booked property reference |
| `room` | ForeignKey(`Room`) | Booked room type reference |
| `customer_name` | CharField(255) | Tenant full name |
| `customer_email` | EmailField | Tenant email address |
| `customer_phone` | CharField(20) | Tenant contact number |
| `status` | CharField(50) | `Confirmed`, `Cancelled`, `Pending` |
| `payment_status` | CharField(50) | `Paid`, `Pending`, `Failed` |
| `payment_date` | DateField | Due / Last payment date |
| `razorpay_order_id` | CharField(255) | Razorpay transaction order ID |
| `razorpay_payment_id` | CharField(255) | Razorpay transaction payment ID |
| `created_at` | DateTimeField | Timestamp of booking creation |

---

## 5. `Review` Model

Stores ratings and text reviews submitted by students.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | BigAutoField | Primary Key |
| `user` | ForeignKey(`User`) | Reviewer reference |
| `property` | ForeignKey(`Property`) | Reviewed property reference |
| `rating` | IntegerField | Star rating (1 to 5) |
| `comment` | TextField | Review feedback text |
| `created_at` | DateTimeField | Review submission date |
