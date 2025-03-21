import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";

import { addressAgentNetwork } from "./agents";

export const mastra = new Mastra({
  networks: { addressAgentNetwork },
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
});
