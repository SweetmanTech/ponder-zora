import { createConfig, mergeAbis } from "@ponder/core";
import { createPublicClient, http, parseAbiItem, fallback } from "viem";
import { zoraProtocolRewardsAbi } from "./abis/zoraProtocolRewards";
import { zoraFactoryImplementationAbi } from "./abis/zoraFactoryImplementation";
import { zora1155ImplementationAbi } from "./abis/zora1155Implementation";

const trasportOpts = {
  retryCount: 10,
  timeout: 100_000
}

const latestBlockMainnet = await createPublicClient({
  transport: fallback([http(process.env.PONDER_RPC_URL_1_FALLBACK, trasportOpts),http(process.env.PONDER_RPC_URL_1, trasportOpts), http(process.env.PONDER_ETH_INFURA, trasportOpts)],{rank:true}),
}).getBlock();
const latestBlockBase = await createPublicClient({
  transport: fallback([http(process.env.PONDER_RPC_URL_8453_FALLBACK, trasportOpts),http(process.env.PONDER_RPC_URL_8453, trasportOpts),http(process.env.PONDER_BASE_RPC, trasportOpts)],{rank:true}),
}).getBlock();
const latestBlockOptimism = await createPublicClient({
  transport: fallback([http(process.env.PONDER_RPC_URL_10_FALLBACK, trasportOpts),http(process.env.PONDER_RPC_URL_10, trasportOpts), http(process.env.PONDER_OPT_INFURA, trasportOpts)],{rank:true}),
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
      transport: fallback([http(process.env.PONDER_RPC_URL_1_FALLBACK, trasportOpts),http(process.env.PONDER_RPC_URL_1, trasportOpts), http(process.env.PONDER_ETH_INFURA, trasportOpts)],{rank:true}),
    },
    base: {
      maxHistoricalTaskConcurrency: 8,
      chainId: 8453,
      transport: fallback([http(process.env.PONDER_RPC_URL_8453_FALLBACK, trasportOpts),http(process.env.PONDER_RPC_URL_8453, trasportOpts),http(process.env.PONDER_BASE_RPC, trasportOpts)],{rank:true}),
    },
    optimism: {
      chainId: 10,
      maxHistoricalTaskConcurrency: 8,
      transport: fallback([http(process.env.PONDER_RPC_URL_10_FALLBACK, trasportOpts),http(process.env.PONDER_RPC_URL_10, trasportOpts), http(process.env.PONDER_OPT_INFURA, trasportOpts)],{rank:true}),
    },
    zora: {
      chainId: 7777777,
      maxHistoricalTaskConcurrency: 2,
      transport: http(process.env.PONDER_RPC_URL_7777777),
    },
  },
  contracts: {
    zora1155Factory: {
      abi: mergeAbis([zoraFactoryImplementationAbi, zora1155ImplementationAbi]),
      factory: {
        // The address of the factory contract that creates instances of this child contract.
        address: "0x777777C338d93e2C7adf08D102d45CA7CC4Ed021",
        // The event emitted by the factory that announces a new instance of this child contract.
        event: parseAbiItem([
          "event SetupNewContract(address indexed newContract,address indexed creator,address indexed defaultAdmin,string contractURI,string name,RoyaltyConfiguration defaultRoyaltyConfiguration)",
          "struct RoyaltyConfiguration {uint32 royaltyMintSchedule;uint32 royaltyBPS;address royaltyRecipient;}"
        ]),
        // The name of the parameter that contains the address of the new child contract.
        parameter: "newContract",
      },
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
