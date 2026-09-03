require("dotenv").config();

const express = require("express");
const app = express();
const metricsRoutes = require("./src/routes/metricsRoutes");
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const mainRoutes = require("./src/routes/mainRoutes");
const { connectRedis } = require("./src/config/redis");
const { enqueueEvent } = require("./src/workers/logWorker");

const {
    httpRequestCounter,
    httpRequestDuration
} = require("./src/config/metrics");

// Request Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.static("public"));

app.post("/api/stress-test", (req, res) => {
    const count = Number(req.body.count) || 10;

    if (count < 1 || count > 1000) {
        return res.status(400).json({
            message: "Count must be between 1 and 1000."
        });
    }

    for (let i = 1; i <= count; i++) {
       enqueueEvent({
    type: "stress_burst",
    requestId: i,
    latencyMs: Math.floor(Math.random() * 1000) + 1
});
    }

    res.json({
        message: "Stress events queued successfully.",
        count
    });
});
app.use((req, res, next) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const duration =
            Number(process.hrtime.bigint() - start) / 1e9;

        const route = req.route?.path || req.path;

        httpRequestCounter.inc({
            method: req.method,
            route,
            status_code: res.statusCode
        });

        httpRequestDuration.observe(
            {
                method: req.method,
                route,
                status_code: res.statusCode
            },
            duration
        );
    });

    next();
});
app.use("/", metricsRoutes);

app.post("/test", (req, res) => {
    console.log("Body received:", req.body);

    res.json({
        body: req.body
    });
});

app.use("/", mainRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);

    console.log("Available endpoints:");
    console.log(`POST http://localhost:${PORT}/api/products`);
    console.log(`GET  http://localhost:${PORT}/api/products`);
    console.log(`GET  http://localhost:${PORT}/api/products/:id`);
    console.log(`PUT  http://localhost:${PORT}/api/products/:id`);
    console.log(`DELETE http://localhost:${PORT}/api/products/:id`);

    try {
        await connectRedis();
        console.log("Redis connection ready.");
    } catch (error) {
        console.error("Redis connection failed:", error.message);
    }
});