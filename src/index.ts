
import { publicListenerClient } from "./client"
import tokenAbi from "../abi/ERC20Token.json"
import type {Abi} from "viem"
import {Effect} from "effect"
import { handleLogs, policy } from "./handler"

// TODO: create and manage listener for contract
// > call webhook when event emitted


function main() {
// initialise listener
const watchInstance = publicListenerClient.watchContractEvent({
  address: '0x2Dda0158EFe7006B8aFf9e5FEe6E9112F16841D8',
  eventName: 'Transfer',
  abi: tokenAbi?.abi as Abi,
  args: { to: '0x0000000000000000000000000000000000000000' },
  onLogs: logs => handleLogs(logs).pipe(Effect.retry({ times: 3}), Effect.runPromise),
  onError: error => console.log(error, "::: error on listening") // setup a graceful shutdown and restart on error, based on the type of error
})


console.log(watchInstance, ":::watcher started")
console.log(Bun.env.NODE_ENV, ":::node env")
  
}


let maxMemoryConsumption = 0;
let _dtoMaxMemoryConsumtion: string;

process.nextTick(() => {
  let memUsage = process.memoryUsage();
  if(memUsage.rss > maxMemoryConsumption) {
    maxMemoryConsumption = memUsage.rss;
    _dtoMaxMemoryConsumtion = new Date().toLocaleTimeString()
  }
})


process.on('exit', () => {
  console.log(`Max memory consumption: ${maxMemoryConsumption} at ${_dtoMaxMemoryConsumtion}`)
})

