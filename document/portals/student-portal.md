---
label: Student & Guest Portal
icon: people
order: 940
---

# 🎓 Student & Guest Portal Documentation

The Student & Guest Portal allows users to explore hostels and PGs, filter properties by budget/location/gender, view detailed room specs, manage wishlists, and execute instant online room bookings.

---

## 🔍 Key Features & Capabilities

### 1. Advanced Search & Filtering (`CollegeSearch.jsx` & `Index.jsx`)
- **Location & City Filter**: Search properties by specific city (e.g. Ahmedabad) or nearby college name.
- **Gender Category**: Filter by `Boys`, `Girls`, or `Co-ed` stay.
- **Budget Slider & Room Type**: Filter properties by max monthly budget and single/sharing room options.

### 2. Property Detail View (`HostelDetail.jsx`)
- **High-Resolution Photo Gallery & Video**: Displays primary images, additional gallery previews, and property walkthrough videos.
- **Room & Bed Matrix**: Real-time breakdown of room types, AC vs. Non-AC options, total beds, available bed count, and monthly rent prices.
- **Similar Properties Slider**: Machine learning KNN powered recommendations (`SimilarProperties.jsx`).
- **Ratings & Tenant Reviews**: Transparent tenant feedback with star rating calculations.

### 3. Wishlist Management (`UserDashboard.jsx`)
- **One-Click Bookmarking**: Tap heart icon on any listing card to toggle wishlist status.
- **Persistent Storage**: Saved properties sync with student backend profile (`User.wishlist`).

### 4. Room Booking & Razorpay Payment (`BookingSuccess.jsx`)
- **Step 1**: Student selects room type, tenant full name, email, and phone number.
- **Step 2**: Backend initializes a Razorpay Order ID.
- **Step 3**: Client opens Razorpay SDK Checkout modal.
- **Step 4**: Upon payment completion, backend verifies Razorpay HMAC signature (`razorpay_signature`) and updates booking status to `Confirmed`.
