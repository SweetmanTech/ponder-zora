import { ponder } from "@/generated";

ponder.on("zoraProtocolRewards:RewardsDeposit", async ({ event, context }) => {
  const { RewardsDeposit } = context.db;

  await RewardsDeposit.create({
    id: `${context.network.name}-${event.block.hash}-${event.log.logIndex}`,
    data: {
      chain: context.network.name,
      timestamp: event.block.timestamp,
      from: event.args.from as string,
      createReferral: event.args.createReferral,
      creator: event.args.creator,
      mintReferral: event.args.mintReferral,
      firstMinter: event.args.firstMinter,
      zora: event.args.zora,
      creatorReward: event.args.creatorReward,
      createReferralReward: event.args.createReferralReward,
      mintReferralReward: event.args.mintReferralReward,
      firstMinterReward: event.args.firstMinterReward,
      zoraReward: event.args.zoraReward,
    }
  });
});

ponder.on("zora1155Factory:SetupNewToken", async ({ event, context }) => {
  const { SetupNewToken } = context.db;

  await SetupNewToken.create({
    id: `${context.network.name}-${event.block.hash}-${event.log.logIndex}`,
    data: {
      contractAddress: event.log.address,
      chain: context.network.name,
      tokenId: event.args.tokenId,
      sender: event.args.sender,
      maxSupply: event.args.maxSupply,
      newURI: event.args.newURI,
      timestamp: event.block.timestamp,
    }
  });
});
