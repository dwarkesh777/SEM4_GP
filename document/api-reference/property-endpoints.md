---
label: Property API
icon: building
order: 890
---

# 🏠 Property API Reference

API endpoints for searching, retrieving, creating, and editing properties.

---

## 1. List Properties (With Search & Filtering)

```http
GET /api/properties/?city=Ahmedabad&gender=Boys&min_price=5000&max_price=12000&search=Navrangpura
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "NestNode Luxury Boys Hostel",
    "type": "Hostel",
    "city": "Ahmedabad",
    "location": "Navrangpura",
    "gender": "Boys",
    "price": "8500.00",
    "rating": 4.8,
    "reviews_count": 14,
    "is_verified": true,
    "main_image": "https://res.cloudinary.com/..."
  }
]
```

---

## 2. Get Single Property Details

```http
GET /api/properties/{id}/
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "NestNode Luxury Boys Hostel",
  "description": "Premium living space near GTU campus with high-speed WiFi...",
  "address": "Opp. University Ground, Navrangpura",
  "phone": "+919876543210",
  "email": "owner@nestnode.com",
  "amenities": ["wifi", "ac", "food", "laundry"],
  "appliances": ["geyser", "fridge", "water_purifier"],
  "rooms": [
    {
      "id": 101,
      "name": "2 Sharing AC",
      "occupancy": "Double",
      "total_beds": 10,
      "available_beds": 4,
      "price": "8500.00",
      "is_ac": "AC"
    }
  ]
}
```

---

## 3. KNN Similar Property Recommendations

```http
GET /api/properties/{id}/knn_similar/
```

**Response (200 OK):**
```json
[
  {
    "id": 4,
    "name": "Campus Edge Hostel",
    "city": "Ahmedabad",
    "price": "8000.00",
    "rating": 4.6
  }
]
```

---

## 4. Create Property (Owner Only)

```http
POST /api/properties/
Headers: Authorization: Bearer <owner_access_token>
Content-Type: multipart/form-data
```

**Form Data Parameters:**
- `name`: String (Required)
- `type`: `Hostel` | `PG` | `Flat`
- `city`: String (Required)
- `location`: String (Required)
- `address`: String (Required)
- `gender`: `Boys` | `Girls` | `Co-ed`
- `price`: Number (Required)
- `description`: String (Required)
- `amenities`: Array of strings
- `rooms_json`: JSON string of room objects
- `main_image`: Image file upload
