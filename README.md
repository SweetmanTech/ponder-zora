# Ponder Zora

Ponder Zora is an open-source implementation of Ponder for Zora Protocol Rewards on Base, OP Mainnet, Zora & Ethereum.

## Quickstart

### 1. Setup Project

Once you clone into the directory of [Ponder Zora](https://github.com/SweetmanTech/ponder-zora-rewards), install packages with your preferred package manager:

```bash
npm install
# or
pnpm install
# or
yarn install
```

then, rename `.env.example` to `.env.local`

```bash
# Mainnet RPC URL used for fetching blockchain data. Alchemy is recommended.
PONDER_RPC_URL_1=https://ethereum.rpc.thirdweb.com

# Optimism RPC URL used for fetching blockchain data. Alchemy is recommended.
PONDER_RPC_URL_10=https://optimism.rpc.thirdweb.com

# Base RPC URL used for fetching blockchain data. Alchemy is recommended.
PONDER_RPC_URL_8453=https://base.rpc.thirdweb.com

# Zora RPC URL used for fetching blockchain data. Alchemy is recommended.
PONDER_RPC_URL_7777777=https://zora.rpc.thirdweb.com
```

### 2. Start the development server

Just like Next.js and Vite, Ponder has a development server that automatically reloads when you save changes in any project file. It also prints `console.log` statements and errors encountered while running your code. First, `cd` into your project directory, then start the server.

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

### 3. Add contracts & networks

Ponder fetches event logs for the contracts added to `ponder.config.ts`, and passes those events to the indexing functions you write.

```ts
// ponder.config.ts
import { http } from "viem";

export const config = {
  networks: [
    {
      name: "mainnet",
      chainId: 1,
      transport: http("https://eth-mainnet.g.alchemy.com/v2/..."),
    },
  ],
  contracts: [
    {
      name: "BaseRegistrar",
      network: "mainnet",
      abi: "./abis/BaseRegistrar.json",
      address: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
      startBlock: 9380410,
    },
  ],
};
```

### 4. Define your schema

The `schema.graphql` file contains a model of your application data. The entity types defined here correspond to database tables.

```ts
// schema.graphql

type EnsName @entity {
  id: String!
  name: String!
  owner: String!
  registeredAt: Int!
}
```

### 5. Write indexing functions

Files in the `src/` directory contain **indexing functions**, which are TypeScript functions that process a contract event. The purpose of these functions is to insert data into the entity store.

```ts
// src/BaseRegistrar.ts

import { ponder } from "@/generated";

ponder.on("BaseRegistrar:NameRegistered", async ({ event, context }) => {
  const { EnsName } = context.entities;
  const { name, owner } = event.params;

  await EnsName.create({
    id: `${name}-${owner}`,
    data: {
      name: name,
      owner: owner,
      registeredAt: event.block.timestamp,
    },
  });
});
```

See the [create & update entities](https://ponder.sh/guides/create-update-entities) docs for a detailed guide on writing indexing functions.

### 6. Query the GraphQL API

Ponder automatically generates a frontend-ready GraphQL API based on your project's `schema.graphql`. The API serves the data that you inserted in your indexing functions.

```ts
{
  ensNames(first: 2) {
    name
    owner
    registeredAt
  }
}
```

```json
{
  "ensNames": [
    {
      "name": "vitalik.eth",
      "owner": "0x0904Dac3347eA47d208F3Fd67402D039a3b99859",
      "registeredAt": 1580345271
    },
    {
      "name": "joe.eth",
      "owner": "0x6109DD117AA5486605FC85e040ab00163a75c662",
      "registeredAt": 1580754710
    }
  ]
}
```

That's it! Visit [ponder.sh](https://ponder.sh) for documentation, guides for deploying to production, and the API reference.
