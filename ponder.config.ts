import { createConfig } from "@ponder/core";
import { createPublicClient, http } from "viem";
import { zoraProtocolRewardsAbi } from "./abis/zoraProtocolRewards";

const latestBlockMainnet = await createPublicClient({
  transport: http(process.env.PONDER_RPC_URL_1),
}).getBlock();
const latestBlockBase = await createPublicClient({
  transport: http(process.env.PONDER_RPC_URL_8453),
}).getBlock();
const latestBlockOptimism = await createPublicClient({
  transport: http(process.env.PONDER_RPC_URL_10),
}).getBlock();
const latestBlockZora = await createPublicClient({
  transport: http(process.env.PONDER_RPC_URL_7777777),
}).getBlock();
const numberOfBlocks = 1000

export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      maxHistoricalTaskConcurrency: 8,
      transport: http(process.env.PONDER_RPC_URL_1),
    },
    base: {
      maxHistoricalTaskConcurrency: 8,
      chainId: 8453,
      transport: http(process.env.PONDER_RPC_URL_8453),
    },
    optimism: {
      chainId: 10,
      maxHistoricalTaskConcurrency: 8,
      transport: http(process.env.PONDER_RPC_URL_10),
    },
    zora: {
      chainId: 7777777,
      maxHistoricalTaskConcurrency: 2,
      transport: http(process.env.PONDER_RPC_URL_7777777),
    },
  },
  contracts: {
    zoraProtocolRewards: {
      abi: zoraProtocolRewardsAbi,
      address: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B",
      network: {
        mainnet: {
          startBlock: Number(latestBlockMainnet.number) - numberOfBlocks,
        },
        base: {
          startBlock: Number(latestBlockBase.number) - numberOfBlocks,
        },
        optimism: {
          startBlock: Number(latestBlockOptimism.number) - numberOfBlocks,
        },
        zora: {
          startBlock: Number(latestBlockZora.number) - numberOfBlocks,
        },
      },
    },
  },
});
