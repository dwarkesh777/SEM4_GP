---
label: Property Owner Portal
icon: briefcase
order: 930
---

# 👨‍💼 Property Owner Portal Documentation

The Property Owner Portal empowers hostel and PG owners (`is_owner=True`) to manage their listings, monitor active student bookings, track monthly revenue, complete verification steps, and edit room availability.

---

## 🛠️ Core Owner Workflows

### 1. Dashboard Overview (`OwnerDashboard.jsx`)
- **Metrics Cards**: Active property listings, total active bookings, total student queries, and monthly earnings.
- **Quick Action Links**: Rapid navigation to listed properties, guest bookings, student enquiries, and identity verification.

### 2. Add Property Wizard (`AddProperty.jsx`)
A 5-step multi-step wizard for creating property listings:
- **Step 1: Basic Info**: Property name, type (Hostel/PG), city, area location, full address, gender suitability, and contact details.
- **Step 2: Pricing & Description**: Starting monthly price, original price, and detailed description.
- **Step 3: Amenities & Appliances**: Interactive multi-select for WiFi, AC, laundry, food, gym, microwave, etc.
- **Step 4: Media Uploads**: Main thumbnail photo, gallery image uploads (Cloudinary compressed), and walkthrough video.
- **Step 5: Rooms & Beds**: Room types, AC status, total bed capacity, and price per bed.
- **Terms & Conditions Modal**: Before listing creation completes, owners must review and accept the platform Terms & Conditions popup modal.

### 3. Profile Completion & Webcam Capture
- **100% Progress Bar**: Dynamic progress tracker checking business name, address, city, state, pincode, bio, and profile photo.
- **Live Webcam Scanner**: Built-in camera scanner modal (`getUserMedia`) allowing owners to snap profile photos directly from desktop/laptop webcams to Cloudinary.

### 4. Owner Identity Verification (`OwnerDashboard.jsx` -> Verification Tab)
- **Mandatory Fields**: PAN Number, Aadhaar Number, Bank Account Number, and IFSC Code.
- **Verified Badge**: Once all 4 fields are submitted, the owner account earns the **Verified Owner** status badge.

### 5. Resident & Bed Management
- **Mark As Paid Modal**: Custom React modal replacing browser alerts when advancing a student's monthly due date.
- **Remove Resident Modal**: Custom React deletion modal releasing occupied room beds back into available bed count.
