const client = require("prom-client");

const register = new client.Registry();

client.collectDefaultMetrics({
    register
});

const httpRequestCounter = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
    registers: [register]
});

const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
    registers: [register]
});

const workerEventsProcessed = new client.Counter({
    name: "worker_events_processed_total",
    help: "Total number of events processed by the worker",
    labelNames: ["event_type"],
    registers: [register]
});

const workerProcessingDuration = new client.Histogram({
    name: "worker_processing_duration_seconds",
    help: "Worker event processing duration in seconds",
    labelNames: ["event_type"],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
    registers: [register]
});

const workerQueueSize = new client.Gauge({
    name: "worker_queue_size",
    help: "Current number of events waiting in the worker queue",
    registers: [register]
});

const stressTestLatency = new client.Histogram({
    name: "stress_test_latency_milliseconds",
    help: "Latency observed by stress test events in milliseconds",
    labelNames: ["event_type"],
    buckets: [10, 25, 50, 100, 250, 500, 1000, 2000],
    registers: [register]
});
const stressTestPeakLatency = new client.Gauge({
    name: "stress_test_peak_latency_milliseconds",
    help: "Peak stress-test latency observed in milliseconds",
    labelNames: ["event_type"],
    registers: [register]
});

module.exports = {
    client,
    register,
    httpRequestCounter,
    httpRequestDuration,
    workerEventsProcessed,
    workerProcessingDuration,
    workerQueueSize,
    stressTestLatency,
    stressTestPeakLatency
};