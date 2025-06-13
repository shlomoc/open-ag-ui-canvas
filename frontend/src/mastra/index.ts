import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { registerCopilotKit } from "@mastra/agui";
import { haikuAgent } from "./agents";
import { createLogger, LogLevel } from "@mastra/core/logger";

// const LOG_LEVEL = process.env.LOG_LEVEL as LogLevel || "info";
 
// Define your runtime context type
type HaikuRuntimeContext = {
  "user-id": string;
  "api-key": string;
  // ...
};
 
export const mastra = new Mastra({
  agents: { 
    haikuAgent
  },
  storage: new LibSQLStore({
    url: ":memory:"
  }),
  server: {
    // disable cors for getting started
    cors: {
      origin: "*",
      allowMethods: ["*"],
      allowHeaders: ["*"],
    },
    apiRoutes: [
      // 🪁 Copilot Runtime: https://docs.copilotkit.ai/guides/self-hosting
      registerCopilotKit<HaikuRuntimeContext>({
        path: "/copilotkit",
        resourceId: "haikuAgent",
        setContext: (c, runtimeContext) => {
          runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
          // whatever context you need to set ...
        }
      }),
    ],
  },
});