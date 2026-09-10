const fs = require("fs");
const path = require("path");
const {
    telemetrySpeedIndex
} = require("../config/metrics");

const logFile = path.join(
    __dirname,
    "../../logs/application.log"
);

let filePosition = 0;
let totalPackets = 0;

function calculateSpeedIndex(latencyMs) {
    if (typeof latencyMs !== "number" || latencyMs <= 0) {
        return 0;
    }

    return Number((1000 / latencyMs).toFixed(2));
}

function processTelemetryPacket(packet) {
    totalPackets++;

    const speedIndex = calculateSpeedIndex(packet.latencyMs);
    telemetrySpeedIndex.set(
    {
        event_type: packet.type || "unknown"
    },
    speedIndex
);

    console.log(
        `[Telemetry] Packet ${totalPackets} | ` +
        `Type: ${packet.type || "unknown"} | ` +
        `Latency: ${packet.latencyMs || 0} ms | ` +
        `Speed Index: ${speedIndex}`
    );
}

function consumeNewTelemetry() {
    if (!fs.existsSync(logFile)) {
        return;
    }

    const stats = fs.statSync(logFile);

    if (stats.size <= filePosition) {
        return;
    }

    const content = fs.readFileSync(logFile, "utf8");

    const newContent = content.slice(filePosition);

    filePosition = content.length;

    const lines = newContent.split(/\r?\n/);

    for (const line of lines) {
        if (!line.trim()) {
            continue;
        }

        try {
            const packet = JSON.parse(line);
            processTelemetryPacket(packet);
        } catch (error) {
            console.error(
                "Invalid telemetry packet:",
                error.message
            );
        }
    }
}

console.log("Starting telemetry consumer...");
console.log(`Watching: ${logFile}`);

if (fs.existsSync(logFile)) {
    filePosition = fs.statSync(logFile).size;
}

setInterval(consumeNewTelemetry, 500);
module.exports = {
    calculateSpeedIndex,
    consumeNewTelemetry
};