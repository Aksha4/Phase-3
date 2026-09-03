const {
    enqueueEvent,
    readLogEvents
} = require("./logWorker");

async function runTest() {
    console.log("Starting log worker test...");

    for (let i = 1; i <= 10; i++) {
        enqueueEvent({
            type: "stress_test",
            requestId: i,
            latencyMs: Math.floor(Math.random() * 500)
        });
    }

    // Give the worker time to process the queue
    setTimeout(async () => {
        const events = await readLogEvents();

        console.log(`Total log events: ${events.length}`);

        console.log(
            "Last event:",
            events[events.length - 1]
        );
    }, 1000);
}

runTest();