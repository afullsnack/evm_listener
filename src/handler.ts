import { formatUnits, type Log } from "viem"
import { Effect, Schedule } from "effect"


// TODO: create retry policy
export const policy = Schedule.fixed("100 millis")

// TODO: receive event
// destructure event details
// note of Transfer event
// call smee webhook client with payload
export const handleLogs = (logs: Log[]) => Effect.gen(function*() {
  yield* Effect.log('Event received....', logs[0])

  const callWebhook = yield* Effect.tryPromise({
    try: () => fetch(
      Bun.env.NODE_ENV === "development"
        ? Bun.env.WEBHOOK_PROXY_PAYLOAD ?? "https://smee.io/f29WKHg05Pg0u4dT"
          : "http://localhost:8080/api/services/blockchain/events/evm/burn",
      { method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          logs[0],
          // TODO: normalize bigint bofore calling webhook
          //> instead of converting to string.
          (_, v) => typeof v === 'bigint' ? formatUnits(v, 6) : v
        )
      }).then((res) => res.json()),
    catch: () => Effect.fail(new Error("Error calling webhook forwarder"))
  })

  yield* Effect.log(callWebhook, ":::webhook called")

  yield* Effect.log("Webhook call finished...")

})
