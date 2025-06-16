import {
    CopilotRuntime,
    OpenAIAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { MastraClient } from "@mastra/client-js";

const serviceAdapter = new OpenAIAdapter();
const runtime = new CopilotRuntime({
    remoteEndpoints: [
        {
            url: process.env.REMOTE_ACTION_URL || "http://0.0.0.0:8000/copilotkit",
        }
    ]
});

export const POST = async (req: NextRequest) => {
    if (req.nextUrl.searchParams.get("isMastra")) {
        const baseUrl = process.env.NEXT_PUBLIC_REMOTE_ACTION_URL_MASTRA || "http://localhost:4111";
        const mastra = new MastraClient({
            baseUrl,
        });
        const mastraAgents = await mastra.getAGUI({
            resourceId: "TEST",
        });
        const runtime = new CopilotRuntime({
            // @ts-ignore
            agents: mastraAgents,
        });
        let mastraRuntime = new CopilotRuntime({
            // @ts-ignore
            agents: mastraAgents,
        });
        const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
            runtime,
            serviceAdapter,
            endpoint: "/api/copilotkit",
        });

        return handleRequest(req);
    }
    else {

        const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
            runtime,
            serviceAdapter,
            endpoint: "/api/copilotkit",
        });

        return handleRequest(req);
    }


};
