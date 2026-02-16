import {

  CopilotRuntime,

  OpenAIAdapter,

  copilotRuntimeNextJSAppRouterEndpoint,

} from "@copilotkit/runtime";

import { LangGraphHttpAgent } from "@copilotkit/runtime/langgraph";

import { NextRequest } from "next/server";

import OpenAI from "openai";
 
// The POST handler for the Next.js API route

export async function POST(req: NextRequest) {

  // Azure OpenAI configuration

  const instance = process.env.AZURE_OPENAI_INSTANCE || "model-gpt-ap001";

  const model = process.env.AZURE_OPENAI_MODEL || "gpt-4o-mini";

  const apiKey = process.env.AZURE_OPENAI_API_KEY || "";

  if (!apiKey) {

    throw new Error("The AZURE_OPENAI_API_KEY environment variable is missing or empty.");

  }
 
  const langgraphUrl = process.env.LANGGRAPH_DEPLOYMENT_URL;

  // Create runtime with LangGraph agent
  // The URL should point directly to the agent endpoint path
  const agentUrl = langgraphUrl ? `${langgraphUrl}/copilotkit` : "http://localhost:8000/copilotkit";

  const runtime = new CopilotRuntime({

    agents: {

      // Backward-compatible alias expected by CopilotKit React (uses "default")
      default: new LangGraphHttpAgent({

        url: agentUrl,

      }),

      // When agent name is changed you don't have to modify the agent name from deafault.
      // sales_crm_supervisor_agent: new LangGraphHttpAgent({
      //   url: agentUrl,
      // }),
    

    },

  });

  // Create Azure OpenAI client

  const openai = new OpenAI({

    apiKey,

    baseURL: `https://${instance}.openai.azure.com/openai/deployments/${model}`,

    defaultQuery: { "api-version": "2025-01-01-preview" },

    defaultHeaders: { "api-key": apiKey },

  });

  // Use OpenAIAdapter with Azure OpenAI client

  const serviceAdapter = new OpenAIAdapter({

    model: model,

    openai: openai as any,

  });

  // Use CopilotRuntime and OpenAIAdapter to handle the request

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({

    runtime,

    serviceAdapter,

    endpoint: "/api/copilotkit",

  });
 
  return handleRequest(req);

}

 