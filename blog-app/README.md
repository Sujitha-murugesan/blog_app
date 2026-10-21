# BlogApp – Module 2: Backend Development

Node.js + Express REST API with a vanilla HTML/CSS/JS frontend connected to it.

## Features
- **User Registration** – `POST /api/auth/register` (bcrypt-hashed passwords, JWT returned)
- **User Login** – `POST /api/auth/login`
- **Create Blog** – `POST /api/blogs` (requires `Authorization: Bearer <token>`)
- List blogs – `GET /api/blogs`, single blog – `GET /api/blogs/:id`
- Frontend pages: Home (blog list), Register, Login, Create Blog

## Setup
```bash
npm install
cp .env.example .env      # already included; change JWT_SECRET
npm start                 # or: npm run dev
```
Open http://localhost:5000

## Project structure
```
server.js            Express app entry
config/db.js         JSON-file data store (data/users.json, data/blogs.json)
middleware/auth.js   JWT verification
routes/auth.js       register + login
routes/blogs.js      create / list blogs
public/              frontend (HTML, CSS, JS) served by Express
```

## API examples
```bash
# Register
curl -X POST localhost:5000/api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Asha","email":"asha@example.com","password":"secret123"}'

# Login
curl -X POST localhost:5000/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"asha@example.com","password":"secret123"}'

# Create blog (use token from login)
curl -X POST localhost:5000/api/blogs -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" -d '{"title":"Hello","content":"My first post"}'
```

## Status codes
201 created · 400 validation error · 401 unauthenticated/invalid credentials · 404 not found · 409 email already registered

## Notes
Data is stored in JSON files so no database install is needed. To move to MongoDB/MySQL, replace `config/db.js` and the read/write calls in `routes/`.
