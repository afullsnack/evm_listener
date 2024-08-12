import type { Log } from "viem"
import {parseUnits} from "viem/utils"
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
      "https://smee.io/plOTQz6JGnW5WlN",
      { method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logs[0], (_, v) => typeof v === 'bigint' ? v.toString() : v)
      }).then((res) => res.json()),
    catch: () => Effect.fail(new Error("Error calling webhook forwarder"))
  })

  yield* Effect.log(callWebhook, ":::webhook called")

  yield* Effect.log("Webhook call finished...")

})
