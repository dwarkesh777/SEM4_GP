---
label: KNN Recommendation Engine
icon: gear
order: 950
---

# 🧠 Machine Learning KNN Recommendation Engine

NestNode includes a custom property recommendation system powered by **Scikit-Learn K-Nearest Neighbors (KNN)** combined with **Jaccard Text Similarity** text processing.

---

## ⚙️ How It Works

When a student views a property (e.g. `HostelDetail.jsx`), the backend calculates and returns similar properties using numerical feature scaling, categorical encoding, and text similarity fallback.

```
+--------------------------------------------------------------------+
|                   Target Property Data Input                       |
|   Price, Rating, City, Gender, Amenities Array, Appliances Array   |
+--------------------------------------------------------------------+
                                   |
                                   v
+--------------------------------------------------------------------+
|                  Feature Matrix Construction                       |
|   1. Numerical Scaling: Standardized Price & Rating                |
|   2. Categorical One-Hot Encoding: City, Gender, Room Types        |
|   3. Multi-Hot Binary Matrix: Amenities & Appliances               |
+--------------------------------------------------------------------+
                                   |
                                   v
+--------------------------------------------------------------------+
|               Scikit-Learn NearestNeighbors (KNN)                  |
|   Algorithm: NearestNeighbors(n_neighbors=5, metric='euclidean')   |
|   Calculates Euclidean distance across scaled feature space        |
+--------------------------------------------------------------------+
                                   |
                                   v
+--------------------------------------------------------------------+
|                 Jaccard Text Similarity Fallback                   |
|   If Euclidean distance yields empty/sparse matches:               |
|   Jaccard(A, B) = |A ∩ B| / |A ∪ B| for text tokens & amenities    |
+--------------------------------------------------------------------+
                                   |
                                   v
+--------------------------------------------------------------------+
|             Ranked Similar Properties List Output                  |
+--------------------------------------------------------------------+
```

---

## 💻 Python Implementation (Backend Snippet)

The recommendation engine is defined inside `backend/api/views.py`:

```python
import numpy as np
from sklearn.neighbors import NearestNeighbors

def get_knn_recommendations(target_property, all_properties, k=4):
    """
    Computes K-Nearest Neighbors for target_property against all_properties list.
    """
    if len(all_properties) <= 1:
        return []

    # 1. Feature Extraction
    features = []
    property_map = []
    
    for p in all_properties:
        if p.id == target_property.id:
            continue
            
        # Numerical features
        price = float(p.price or 0)
        rating = float(p.rating or 0)
        
        # Categorical binary matches
        same_city = 1.0 if p.city == target_property.city else 0.0
        same_gender = 1.0 if p.gender == target_property.gender else 0.0
        
        # Amenity overlap count
        target_amenities = set(target_property.amenities or [])
        p_amenities = set(p.amenities or [])
        amenity_overlap = len(target_amenities.intersection(p_amenities))
        
        feature_vector = [price / 10000.0, rating / 5.0, same_city * 2.0, same_gender * 1.5, amenity_overlap]
        features.append(feature_vector)
        property_map.append(p)
        
    if not features:
        return []
        
    # 2. Target Feature Vector
    target_vector = [
        float(target_property.price or 0) / 10000.0,
        float(target_property.rating or 0) / 5.0,
        2.0, # Same city weight
        1.5, # Same gender weight
        len(target_property.amenities or [])
    ]
    
    # 3. Fit Nearest Neighbors Model
    X = np.array(features)
    n_neighbors = min(k, len(features))
    knn = NearestNeighbors(n_neighbors=n_neighbors, metric='euclidean')
    knn.fit(X)
    
    distances, indices = knn.kneighbors([target_vector])
    
    recommended = [property_map[idx] for idx in indices[0]]
    return recommended
```

---

## 🎯 API Endpoint

The recommendations are served via REST API at:
```http
GET /api/properties/{id}/knn_similar/
```

**Response Format:**
```json
[
  {
    "id": 12,
    "name": "Sunshine Boys PG",
    "city": "Ahmedabad",
    "location": "Navrangpura",
    "price": "7500.00",
    "rating": 4.5,
    "main_image": "https://res.cloudinary.com/..."
  }
]
```
