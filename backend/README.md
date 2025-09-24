# Backend - Koore Government Portal

## Quick start
1. Copy `.env.example` to `.env` and fill values.
2. npm install
3. npm run dev
4. Open http://localhost:5000/health

## Scripts
- npm run dev   => development with auto-reload
- npm run build => compile TypeScript to dist/
- npm run start => run compiled production code

## Authentication

### Register User

`POST /api/auth/register`

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "PUBLIC"
}


Login User

POST /api/auth/login

Request body:

{
  "email": "john@example.com",
  "password": "password123"
}

Response:

{
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "PUBLIC" },
  "token": "jwt_token_here"
}

Get Logged-in User Profile

GET /api/users/me

Headers:

Authorization: Bearer <jwt_token_here>

Response:

{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "PUBLIC",
  "createdAt": "2025-08-11T12:00:00.000Z",
  "updatedAt": "2025-08-11T12:00:00.000Z"
}


