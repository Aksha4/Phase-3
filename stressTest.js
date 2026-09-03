const {
    enqueueEvent,
    readLogEvents
} = require("./logWorker");

const TOTAL_EVENTS = 100;

async function runStressTest() {
    console.log("=================================");
    console.log("Week 8 Stress Burst Test");
    console.log("=================================");

    console.log(`Generating ${TOTAL_EVENTS} events...`);

    const startTime = process.hrtime.bigint();

    for (let i = 1; i <= TOTAL_EVENTS; i++) {
        enqueueEvent({
            type: "stress_burst",
            requestId: i,
            latencyMs: Math.floor(Math.random() * 1000) + 1
        });
    }

    // Give the asynchronous worker time to finish
    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });

    const endTime = process.hrtime.bigint();

    const totalDuration =
        Number(endTime - startTime) / 1e9;

    const events = await readLogEvents();

    const stressEvents = events.filter(
        (event) => event.type === "stress_burst"
    );

    const latencies = stressEvents
        .map((event) => event.latencyMs)
        .filter((value) => typeof value === "number");

    const peakLatency = Math.max(...latencies);
    const averageLatency =
        latencies.reduce((sum, value) => sum + value, 0) /
        latencies.length;

    console.log("");
    console.log("========== RESULTS ==========");
    console.log(`Events generated: ${TOTAL_EVENTS}`);
    console.log(`Events recorded: ${stressEvents.length}`);
    console.log(
        `Average latency: ${averageLatency.toFixed(2)} ms`
    );
    console.log(`Peak latency: ${peakLatency} ms`);
    console.log(
        `Total processing time: ${totalDuration.toFixed(3)} seconds`
    );
    console.log("=============================");
}

runStressTest().catch((error) => {
    console.error("Stress test failed:", error);
});