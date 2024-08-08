import { createPublicClient, http } from "viem"
import { bscTestnet } from "viem/chains"


export const publicListenerClient = createPublicClient({
  chain: bscTestnet,
  transport: http()
})
