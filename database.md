# Database Documentation

## Database

This project uses SQLite as the database.

Database file:

```
src/database/backend.db
```

## Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary Key |
| username | TEXT | User name |
| email | TEXT | Unique email address |
| password | TEXT | Hashed password |
| created_at | DATETIME | User creation time |

## Authentication

- Passwords are hashed using bcryptjs.
- JWT is used for authentication.
- Protected routes require a valid Bearer token.

## API Endpoints

### POST /api/auth/register
Creates a new user.

### POST /api/auth/login
Authenticates a user and returns a JWT token.

### GET /api/auth/profile
Protected route that returns the authenticated user's information.