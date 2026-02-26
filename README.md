# TasteHome API

A RESTful backend API for TasteHome — a recipe sharing platform. Built with **Node.js**, **Express**, and **PostgreSQL** (hosted on Render).

## Live URL

**https://tastehome-api.onrender.com**

---

## Technologies

- Node.js + Express 4
- PostgreSQL via `pg` (cloud-hosted on Render)
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcrypt`)
- Environment configuration (`dotenv`)

---

## Project Structure

```
backend/
├── config/
│   ├── db.js              # PostgreSQL connection pool
│   └── initDB.js          # Auto-creates tables on startup
├── controllers/
│   ├── authController.js  # register & login logic
│   ├── userController.js  # User CRUD
│   ├── recipeController.js # Recipe CRUD
│   └── reviewController.js # Review CRUD
├── middleware/
│   └── authMiddleware.js  # JWT verification (protects private routes)
├── routes/
│   ├── authRoutes.js      # POST /register, POST /login
│   ├── userRoutes.js      # /api/users CRUD
│   ├── recipeRoutes.js    # /api/recipes CRUD
│   └── reviewRoutes.js    # /api/reviews CRUD
├── .env.example           # Environment variable template
├── .gitignore
├── database.sql           # SQL schema
├── package.json
├── server.js              # Application entry point
├── TasteHome.postman_collection.json
└── README.md
```

---

## Database Schema (3 Entities + Relationships)

| Entity | Table | Relationship |
|--------|-------|-------------|
| Users | `users` | Base entity |
| Recipes (Resource A) | `recipes` | `user_id` FK → `users.id` (One-to-Many) |
| Reviews (Resource B) | `reviews` | `recipe_id` FK → `recipes.id`, `user_id` FK → `users.id` |

---

## API Endpoints

### Auth (Public)
| Method | Route | Status |
|--------|-------|--------|
| POST | `/api/auth/register` | 201 |
| POST | `/api/auth/login` | 200 |

### Users (Private — Bearer token required)
| Method | Route | Status |
|--------|-------|--------|
| GET | `/api/users` | 200 |
| GET | `/api/users/:id` | 200 / 404 |
| PUT | `/api/users/:id` | 200 / 404 |
| DELETE | `/api/users/:id` | 200 / 404 |

### Recipes (GET public, writes private)
| Method | Route | Status |
|--------|-------|--------|
| GET | `/api/recipes` | 200 |
| GET | `/api/recipes/:id` | 200 / 404 |
| POST | `/api/recipes` | 201 |
| PUT | `/api/recipes/:id` | 200 / 403 / 404 |
| DELETE | `/api/recipes/:id` | 200 / 403 / 404 |
| GET | `/api/recipes/:recipeId/reviews` | 200 |
| POST | `/api/recipes/:recipeId/reviews` | 201 |

### Reviews (GET public, writes private)
| Method | Route | Status |
|--------|-------|--------|
| GET | `/api/reviews` | 200 |
| GET | `/api/reviews/:id` | 200 / 404 |
| PUT | `/api/reviews/:id` | 200 / 403 / 404 |
| DELETE | `/api/reviews/:id` | 200 / 403 / 404 |

---

## Local Setup

1. Clone and navigate to backend:
   ```bash
   git clone https://github.com/Gunu2508/TasteHome.git
   cd TasteHome
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` from template:
   ```bash
   cp .env.example .env
   # Fill in your DATABASE_URL and JWT_SECRET
   ```

4. Start the server:
   ```bash
   npm start
   ```

---

## Deployment

- **API:** Hosted on [Render](https://render.com) — https://tastehome-api.onrender.com
- **Database:** PostgreSQL hosted on [Render](https://render.com)

---

## Author

**Gunveer** - GitHub: [Gunu2508](https://github.com/Gunu2508)
