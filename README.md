Phase 3 Backend Development Project
A Node.js and Express backend application developed progressively through Weeks 1–7.

The project uses Express, SQLite, JWT authentication, bcrypt password hashing, validation, product CRUD operations, transactions, and Redis caching.

Technologies Used
Node.js
Express.js
SQLite
bcryptjs
JSON Web Token (JWT)
dotenv
Redis
Docker
Jest
Thunder Client
Project Features
Authentication
User registration
Password hashing with bcrypt
User login
JWT token generation
Protected API endpoints
JWT validation
Invalid/expired token handling
Product Management
Create products
Get all products
Get product by ID
Update products
Delete products
Search products
Pagination
Product validation
User-Product Relationship
Week 7 introduced a relationship between users and products.

Each newly created product can be associated with the authenticated user's ID.

User
 |
 | 1
 |
 | many
 ↓
Products
## Week 8 — Performance Telemetry & Stress Testing

### Overview

Week 8 adds performance telemetry, asynchronous worker processing,
stress-burst testing, Prometheus-compatible metrics, and a responsive
system performance dashboard.

### Features

- Prometheus `/metrics` endpoint
- HTTP request counter and duration metrics
- Asynchronous high-frequency event worker
- JSON application log processing
- Worker queue-size monitoring
- Worker processing-duration metrics
- Stress-test latency metrics
- Peak stress latency monitoring
- Responsive telemetry dashboard
- Simulated 100-event stress burst

### Telemetry Dashboard

Open:

http://localhost:3000/telemetry.html

The dashboard displays:

- Worker events
- Peak stress latency
- Memory usage
- Queue size
- Stress-test latency time series
- Worker processing time
- Telemetry connection status

### Stress Test

The stress test endpoint accepts a configurable event count:

```text
POST /api/stress-test
## How to Run

1. Open terminal
2. Run:

node app.js

3. Open browser:

http://localhost:3000
