const fs = require("fs");
const path = require("path");

const {
    workerEventsProcessed,
    workerProcessingDuration,
    workerQueueSize,
    stressTestLatency,
    stressTestPeakLatency
} = require("../config/metrics");

const logDirectory = path.join(__dirname, "../../logs");
const logFile = path.join(logDirectory, "application.log");

const eventQueue = [];
let processing = false;

// Store peak latency safely in application memory
const peakLatencies = {};

// Make sure logs directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Make sure log file exists
if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, "");
}

// Add an event to the high-frequency queue
function enqueueEvent(event) {
    eventQueue.push(event);

    workerQueueSize.set(eventQueue.length);

    console.log(
        `Event queued. Queue size: ${eventQueue.length}`
    );

    processQueue();
}

// Process queued events asynchronously
async function processQueue() {
    if (processing) {
        return;
    }

    processing = true;

    while (eventQueue.length > 0) {
        const event = eventQueue.shift();

        workerQueueSize.set(eventQueue.length);

        try {
            await processEvent(event);
        } catch (error) {
            console.error(
                "Worker failed to process event:",
                error.message
            );
        }
    }

    processing = false;
}

// Process one event
async function processEvent(event) {
    const start = process.hrtime.bigint();

    const line = JSON.stringify({
        timestamp: new Date().toISOString(),
        ...event
    });

    await fs.promises.appendFile(
        logFile,
        line + "\n",
        "utf8"
    );

    const duration =
        Number(process.hrtime.bigint() - start) / 1e9;

    const eventType = event.type || "unknown";

    workerEventsProcessed.inc({
        event_type: eventType
    });

    workerProcessingDuration.observe(
        {
            event_type: eventType
        },
        duration
    );

    // Record latency metrics
    if (typeof event.latencyMs === "number") {
        stressTestLatency.observe(
            {
                event_type: eventType
            },
            event.latencyMs
        );

        const currentPeak = peakLatencies[eventType] || 0;

        if (event.latencyMs > currentPeak) {
            peakLatencies[eventType] = event.latencyMs;

            stressTestPeakLatency.set(
                {
                    event_type: eventType
                },
                event.latencyMs
            );
        }
    }

    console.log("Event processed:", eventType);
}

// Read and parse existing log events
async function readLogEvents() {
    const content = await fs.promises.readFile(
        logFile,
        "utf8"
    );

    if (!content.trim()) {
        return [];
    }

    return content
        .trim()
        .split("\n")
        .map((line) => {
            try {
                return JSON.parse(line);
            } catch {
                return null;
            }
        })
        .filter(Boolean);
}

module.exports = {
    enqueueEvent,
    processQueue,
    readLogEvents
};