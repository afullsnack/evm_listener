
import { publicListenerClient } from "./src/client"
import tokenAbi from "./abi/ERC20Token.json"
import type {Abi} from "viem"
import {Console, Effect} from "effect"
import { handleLogs } from "./src/handler"

// TODO: create and manage listener for contract
// > call webhook when event emitted

// console.log(Bun.env.WEBHOOK_PROXY_PAYLOAD, ':::webhook proxy')

const watchInstance = publicListenerClient.watchContractEvent({
  address: '0x2Dda0158EFe7006B8aFf9e5FEe6E9112F16841D8',
  eventName: 'Transfer',
  abi: tokenAbi?.abi as Abi,
  args: { to: '0x0000000000000000000000000000000000000000' },
  onLogs: logs => handleLogs(logs)
    .pipe(
      Effect.retry({ times: 3}),
      Effect.catchAll((e) => Console.log(e, ":::error occurred")),
      Effect.runPromise,
    ),
  onError: error => console.log(error, "::: error on listening") // setup a graceful shutdown and restart on error, based on the type of error
})

console.log("Watcher started.....");
