import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  RewardsDeposit: p.createTable({
    id: p.string(),
    timestamp: p.bigint(),
    chain: p.string(),
    from: p.string(),
    createReferral: p.string(),
    creator: p.string(),
    mintReferral: p.string(),
    firstMinter: p.string(),
    zora: p.string(),
    creatorReward: p.bigint(),
    createReferralReward: p.bigint(),
    mintReferralReward: p.bigint(),
    firstMinterReward: p.bigint(),
    zoraReward: p.bigint(),
  })
}));
