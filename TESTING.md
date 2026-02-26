# TasteHome API - Postman Testing Guide

**Base URL:** `https://tastehome-api.onrender.com`

---

## How to Import Collection

1. Open Postman
2. Click **Import** → select `TasteHome.postman_collection.json`
3. Set collection variable `base_url` = `https://tastehome-api.onrender.com`

---

## Step-by-Step Testing Order

### STEP 1 — Health Check
| Method | URL | Expected |
|--------|-----|----------|
| GET | `https://tastehome-api.onrender.com/` | 200 — `"TasteHome API is running"` |

---

### STEP 2 — Register a User
**POST** `https://tastehome-api.onrender.com/api/auth/register`

**Body (raw JSON):**
```json
{
  "name": "Gunveer Singh",
  "email": "gunveer@example.com",
  "password": "password123"
}
```
**Expected:** `201 Created` — returns a JWT token
**Copy the token from the response!**

---

### STEP 3 — Login
**POST** `https://tastehome-api.onrender.com/api/auth/login`

**Body (raw JSON):**
```json
{
  "email": "gunveer@example.com",
  "password": "password123"
}
```
**Expected:** `200 OK` — returns a JWT token
**Copy the token — paste it in the Authorization header for all steps below**

> **How to set token in Postman:**
> In each protected request → Headers tab → add:
> `Key: Authorization` | `Value: Bearer YOUR_TOKEN_HERE`

---

### STEP 4 — Get All Users *(Protected)*
**GET** `https://tastehome-api.onrender.com/api/users`
**Header:** `Authorization: Bearer <token>`
**Expected:** `200 OK` — list of users (no passwords)

---

### STEP 5 — Get User by ID *(Protected)*
**GET** `https://tastehome-api.onrender.com/api/users/1`
**Header:** `Authorization: Bearer <token>`
**Expected:** `200 OK` — single user object

> Replace `1` with the actual `id` from Step 2 response

---

### STEP 6 — Update User *(Protected)*
**PUT** `https://tastehome-api.onrender.com/api/users/1`
**Header:** `Authorization: Bearer <token>`

**Body (raw JSON):**
```json
{
  "name": "Gunveer Singh Updated"
}
```
**Expected:** `200 OK` — updated user object

---

### STEP 7 — Get All Recipes *(Public)*
**GET** `https://tastehome-api.onrender.com/api/recipes`
**Expected:** `200 OK` — list of recipes with author name

---

### STEP 8 — Create Recipe *(Protected)*
**POST** `https://tastehome-api.onrender.com/api/recipes`
**Header:** `Authorization: Bearer <token>`

**Body (raw JSON):**
```json
{
  "title": "Butter Chicken",
  "description": "A classic creamy North Indian curry",
  "ingredients": "500g chicken, 2 tbsp butter, 1 cup tomato puree, 1 cup cream, spices",
  "instructions": "1. Marinate chicken. 2. Cook in butter. 3. Add tomato puree. 4. Simmer with cream.",
  "category": "Dinner"
}
```
**Expected:** `201 Created` — new recipe object
**Copy the `id` from response — you will need it below**

---

### STEP 9 — Get Recipe by ID *(Public)*
**GET** `https://tastehome-api.onrender.com/api/recipes/1`
**Expected:** `200 OK` — single recipe with author name

> Replace `1` with the `id` from Step 8

---

### STEP 10 — Update Recipe *(Protected)*
**PUT** `https://tastehome-api.onrender.com/api/recipes/1`
**Header:** `Authorization: Bearer <token>`

**Body (raw JSON):**
```json
{
  "title": "Butter Chicken (Updated)",
  "category": "Main Course"
}
```
**Expected:** `200 OK` — updated recipe object

---

### STEP 11 — Create Review *(Protected)*
**POST** `https://tastehome-api.onrender.com/api/recipes/1/reviews`
**Header:** `Authorization: Bearer <token>`

**Body (raw JSON):**
```json
{
  "rating": 5,
  "comment": "Absolutely delicious! Everyone loved it."
}
```
**Expected:** `201 Created` — new review object
**Copy the `id` from response**

---

### STEP 12 — Get All Reviews for a Recipe *(Public)*
**GET** `https://tastehome-api.onrender.com/api/recipes/1/reviews`
**Expected:** `200 OK` — list of reviews for that recipe

---

### STEP 13 — Get All Reviews *(Public)*
**GET** `https://tastehome-api.onrender.com/api/reviews`
**Expected:** `200 OK` — all reviews with reviewer name and recipe title

---

### STEP 14 — Get Review by ID *(Public)*
**GET** `https://tastehome-api.onrender.com/api/reviews/1`
**Expected:** `200 OK` — single review

> Replace `1` with the `id` from Step 11

---

### STEP 15 — Update Review *(Protected)*
**PUT** `https://tastehome-api.onrender.com/api/reviews/1`
**Header:** `Authorization: Bearer <token>`

**Body (raw JSON):**
```json
{
  "rating": 4,
  "comment": "Great recipe, slightly adjusted the spices."
}
```
**Expected:** `200 OK` — updated review object

---

### STEP 16 — Delete Review *(Protected)*
**DELETE** `https://tastehome-api.onrender.com/api/reviews/1`
**Header:** `Authorization: Bearer <token>`
**Expected:** `200 OK` — `"Review deleted successfully"`

---

### STEP 17 — Delete Recipe *(Protected)*
**DELETE** `https://tastehome-api.onrender.com/api/recipes/1`
**Header:** `Authorization: Bearer <token>`
**Expected:** `200 OK` — `"Recipe deleted successfully"`

---

### STEP 18 — Delete User *(Protected)*
**DELETE** `https://tastehome-api.onrender.com/api/users/1`
**Header:** `Authorization: Bearer <token>`
**Expected:** `200 OK` — `"User deleted successfully"`

---

## HTTP Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK — request succeeded |
| 201 | Created — new resource created |
| 400 | Bad Request — missing required fields |
| 401 | Unauthorized — no token or invalid token |
| 403 | Forbidden — token valid but not the owner |
| 404 | Not Found — resource does not exist |
| 500 | Server Error — something went wrong on the server |

---

## Error Test Cases

| Test | How | Expected |
|------|-----|----------|
| No token on protected route | Remove Authorization header | `401 Unauthorized` |
| Wrong password on login | Use wrong password | `401 Unauthorized` |
| Get non-existent resource | GET `/api/recipes/9999` | `404 Not Found` |
| Update someone else's recipe | Use different user's token | `403 Forbidden` |
| Register with duplicate email | Register same email twice | `400 Bad Request` |
