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

Week 10 – Telemetry, Responsive Dashboard & HTTPS

Overview

Week 10 focused on building a responsive dashboard that consumes telemetry data dynamically, processing telemetry packets through a worker/consumer pipeline, exposing custom Prometheus metrics, and verifying HTTPS, rate limiting, and browser cache policies.

Objectives

Process telemetry log-event streams.

Calculate a real-time telemetry speed index.

Expose custom statistics through a Prometheus /metrics endpoint.

Display telemetry and performance data in a responsive dashboard.

Apply API rate limiting.

Configure browser cache-control policies for the telemetry page.

Configure local HTTPS using a self-signed localhost certificate.

Verify the implementation with stress-test results.

Project Structure

week1-project/
├── certs/
│   ├── localhost-cert.pem
│   └── localhost-key.pem
├── logs/
│   └── application.log
├── public/
│   └── telemetry.html
├── src/
│   ├── config/
│   │   ├── metrics.js
│   │   └── redis.js
│   ├── routes/
│   │   └── metricsRoutes.js
│   └── workers/
│       ├── logWorker.js
│       └── telemetryConsumer.js
└── app.js

Security: Do not commit localhost-key.pem, .env, database secrets, or other private credentials to GitHub.

1. Telemetry Consumer

The telemetry consumer watches the application log for newly appended events.

It:

Reads newly added log content.

Parses each JSON telemetry packet.

Calculates the speed index.

Updates the Prometheus telemetry gauge.

Prints the processed packet to the terminal.

Speed Index Formula

Speed Index = 1000 / latency_ms

Example:

Latency = 200 ms
Speed Index = 1000 / 200 = 5

2. Prometheus Metrics

The project exposes metrics at:

https://localhost:3000/metrics

Important Week 10 metrics include:

telemetry_speed_index
worker_events_processed_total
stress_test_peak_latency_milliseconds
worker_queue_size

The telemetry_speed_index metric uses the telemetry event type as a label.

Example:

telemetry_speed_index{event_type="stress_burst"} 2.99

3. Responsive Telemetry Dashboard

The dashboard is available at:

https://localhost:3000/telemetry.html

The dashboard displays telemetry and system information including:

Worker Events

Peak Stress Latency

Memory Usage

Queue Size

Speed Index

Time-series charts

Telemetry connection/status information

The dashboard refreshes the Prometheus metrics periodically so the displayed values can change as new telemetry is processed.

4. API Rate Limiting

The API is protected with express-rate-limit.

Configuration:

Window: 60 seconds
Limit: 100 requests

The limiter is applied to:

/api

When the limit is exceeded, the API returns HTTP 429.

Example response:

{
  "message": "Too many requests. Please try again later."
}

5. Browser Cache Policy

The telemetry page is configured with:

Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0

This helps ensure the telemetry dashboard does not display an unnecessarily cached copy of the page.

6. HTTPS / SSL

The Express application was changed to use an HTTPS server:

https.createServer(sslOptions, app).listen(PORT, async () => {
    // server startup
});

The SSL configuration reads:

certs/localhost-key.pem
certs/localhost-cert.pem

The local server is available at:

https://localhost:3000

Because the certificate is self-signed, browsers may display a certificate warning for localhost. This is expected for local development.

7. Stress Test Endpoint

The project includes:

POST /api/stress-test

Example request:

{
  "count": 5
}

The endpoint queues stress_burst telemetry events with simulated latency values.

8. Verified Telemetry Test

A stress test containing 5 events was successfully processed.

Packet

Latency

Speed Index

1

373 ms

2.68

2

50 ms

20.00

3

959 ms

1.04

4

200 ms

5.00

5

335 ms

2.99

The terminal confirmed:

[Telemetry] Packet 1 | Type: stress_burst | Latency: 373 ms | Speed Index: 2.68
[Telemetry] Packet 2 | Type: stress_burst | Latency: 50 ms | Speed Index: 20
[Telemetry] Packet 3 | Type: stress_burst | Latency: 959 ms | Speed Index: 1.04
[Telemetry] Packet 4 | Type: stress_burst | Latency: 200 ms | Speed Index: 5
[Telemetry] Packet 5 | Type: stress_burst | Latency: 335 ms | Speed Index: 2.99

9. Prometheus Verification

After processing the five packets, the following values were verified:

telemetry_speed_index{event_type="stress_burst"} 2.99
worker_events_processed_total{event_type="stress_burst"} 5
stress_test_peak_latency_milliseconds{event_type="stress_burst"} 959

The worker queue returned to:

worker_queue_size 0

This confirms that the five stress events were processed successfully.

10. Performance Observations

Earlier stress-audit measurements for the project recorded:

Measurement

Result

Baseline working set

≈65.01 MB

Working set after 1000 events

≈66.27 MB

Working-set increase

≈1.26 MB

50 /metrics requests

1.319 s total

Average /metrics request time

≈26.4 ms

1000-event stress API request

≈113.75 ms

Average worker processing time

≈0.95 ms/event

Peak simulated stress latency

1000 ms

These results indicate that the worker pipeline processed the stress workload while maintaining a relatively small observed working-set increase.

11. Database and Redis Verification

The HTTPS server startup continued to establish both major backend connections:

Connected to SQLite database.
Redis socket connected.
Redis client ready.
Redis connection ready.

12. Week 10 Completion Checklist

Telemetry consumer implemented

Telemetry packets processed successfully

Real-time speed index calculated

Prometheus telemetry metric added

/metrics endpoint verified

Responsive telemetry dashboard implemented

API rate limiting configured

Browser cache policy configured

Local HTTPS/SSL configured

Stress-test endpoint verified

Five telemetry packets verified

Peak latency metric verified

SQLite connection verified

Redis connection verified

Conclusion

Week 10 successfully integrated telemetry processing, real-time speed-index calculation, Prometheus monitoring, a responsive dashboard, API rate limiting, browser cache controls, and local HTTPS into the backend project.

The verified five-event stress test produced matching telemetry and Prometheus results, providing evidence that the telemetry pipeline and monitoring layer are functioning correctly


---

# Week 11 Assessment — Graduation Profile Setup

## Week 11 Objective

Prepare the Phase-2 backend for a production-style sandbox using Docker containerization, CI/CD automation, service networking, and secure runtime configuration.

## Week 11 Work Completed

### 1. Multi-Stage Dockerization

A multi-stage `Dockerfile` was created using `node:24-alpine`.

**Dependencies stage:**

```dockerfile
FROM node:24-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev
```

**Production stage:**

```dockerfile
FROM node:24-alpine AS production

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY app.js ./
COPY src ./src
COPY public ./public
COPY docs ./docs

EXPOSE 3000

CMD ["node", "app.js"]
```

The multi-stage approach separates dependency installation from the production runtime image.

### 2. Docker Image Verification

Docker version used:

```text
Docker 29.4.3
```

The image was successfully built:

```text
phase2-week11:latest
```

Reported Docker content size:

```text
68.2 MB
```

### 3. Docker Container Deployment

The production container was created as:

```text
phase2-week11-container
```

Port mapping:

```text
0.0.0.0:3000 -> 3000/tcp
```

The application was verified at:

```text
https://localhost:3000
```

The metrics endpoint was verified at:

```text
https://localhost:3000/metrics
```

### 4. HTTPS Runtime Certificates

Local HTTPS certificates:

```text
certs/localhost-cert.pem
certs/localhost-key.pem
```

The private key is not copied into the Docker image. The certificates are mounted into the container at runtime.

Example:

```powershell
docker run -d --name phase2-week11-container -p 3000:3000 -v "${PWD}\certs:/app/certs:ro" phase2-week11
```

The `certs/` directory is excluded from Git.

### 5. Redis Docker Networking

Redis container:

```text
week7-redis
```

Dedicated Docker network:

```text
phase2-network
```

Both the application container and Redis container were connected to this network.

Redis configuration:

```text
redis://week7-redis:6379
```

Successful startup logs included:

```text
Redis socket connected.
Redis client ready.
Redis connection ready.
```

### 6. GitHub Actions CI

The CI workflow was created at:

```text
.github/workflows/ci.yml
```

The workflow performs:

1. Checkout repository.
2. Set up Node.js 24.
3. Install dependencies with `npm ci`.
4. Run Jest tests.
5. Build the Docker image.

Workflow configuration:

```yaml
name: Week 11 CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build Docker image
        run: docker build -t phase2-week11 .
```

### 7. Test Verification

The local Jest test run completed successfully:

```text
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

Jest displayed a module naming collision warning involving `tests/package.json`, but the test suite itself passed successfully.

### 8. Git Security

The following local/runtime files are excluded from Git:

```text
node_modules/
tests/node_modules/
.env
certs/
logs/
src/database/*.db
```

This prevents environment variables, private certificates, logs, dependencies, and the SQLite database from being committed.

A staged-file security check was performed for names containing:

```text
env
key
cert
db
node_modules
```

No matching sensitive staged files were found.

### 9. Git Commits

Week 11 work was committed locally using:

```text
a3c0339 Complete Week 11 Docker CI/CD setup
3e2347d Ignore local certificates and database
```

Final local Git status:

```text
nothing to commit, working tree clean
```

GitHub remote:

```text
https://github.com/Aksha4/Phase-2.git
```

The remote was configured locally. The commits had not yet been pushed to GitHub at the time of this assessment.

## Week 11 Deliverables

- [x] Multi-stage Dockerfile created
- [x] Docker image built successfully
- [x] Production container started
- [x] Redis connected through Docker network
- [x] HTTPS certificate mounted at runtime
- [x] GitHub Actions CI workflow created
- [x] Jest test verification completed
- [x] Docker build included in CI
- [x] Sensitive local files excluded from Git
- [x] Week 11 commits created
- [x] Working tree verified clean

## Week 11 Conclusion

Week 11 established a containerized and CI-ready foundation for the Phase-2 backend. The application was packaged with a multi-stage Docker build, deployed in a Docker container, connected to Redis through a dedicated network, and configured for HTTPS using runtime-mounted certificates.

GitHub Actions was configured to automate dependency installation, testing, and Docker image building. Git ignore rules were also updated to keep local secrets, certificates, logs, dependencies, and the SQLite database outside source control.

## Repository

https://github.com/Aksha4/Phase-2
