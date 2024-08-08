import { publicListenerClient } from "./client"
import tokenAbi from "./ERC20Token.json"
import type {Abi} from "viem"

// TODO: create and manage listener for contract
// > call webhook when event emitted

const watchInstance = publicListenerClient.watchContractEvent({
  address: '0x2Dda0158EFe7006B8aFf9e5FEe6E9112F16841D8',
  eventName: 'Transfer',
  abi: tokenAbi?.abi as Abi,
  args: { to: '0x0000000000000000000000000000000000000000' },
  onLogs: logs => console.log(logs, ":::logs from event"),
  onError: error => console.log(error, "::: error on listening") // setup a graceful shutdown and restart on error, based on the type of error
})


console.log(watchInstance, ":::watcher started")
