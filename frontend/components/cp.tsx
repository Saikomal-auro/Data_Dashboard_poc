"use client";

/**
 * ChatPopup.tsx
 *
 * Registers three useFrontendTool hooks.
 * The Python agent calls these tools by name in its AIMessage tool_calls.
 * CopilotKit streams the call to the browser → our handler fires → setState → Dashboard re-renders.
 *
 * Tool name in Python agent  ←→  useFrontendTool name here
 * ──────────────────────────────────────────────────────
 * "set_loading"              ←→  "set_loading"
 * "update_dashboard"         ←→  "update_dashboard"
 * "navigate_to_page"         ←→  "navigate_to_page"
 *
 * Props:
 *   onSetLoading(isLoading, message) → Dashboard shows/hides spinner
 *   onUpdateDashboard({ dashboard_data, title, insights, active_page }) → Dashboard re-renders
 *   onNavigate(page) → Dashboard switches active tab
 */

import React, { useState } from "react";
import { useFrontendTool } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";

interface ChatPopupProps {
  onClose: () => void;
  onSetLoading: (isLoading: boolean, message: string) => void;
  onUpdateDashboard: (data: {
    dashboard_data: any;
    title: string;
    insights: string[];
    active_page: number;
  }) => void;
  onNavigate: (page: number) => void;
}

export default function ChatPopup({
  onClose,
  onSetLoading,
  onUpdateDashboard,
  onNavigate,
}: ChatPopupProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // ── Tool 1: set_loading ──────────────────────────────────────────────────
  // Agent calls this to show/hide the loading spinner in the Dashboard
  useFrontendTool({
    name: "set_loading",
    description: "Show or hide the loading spinner on the dashboard with a status message.",
    parameters: [
      { name: "is_loading", type: "boolean", description: "Whether to show the spinner", required: true },
      { name: "message",    type: "string",  description: "Status text to display",     required: false },
    ],
    handler: async ({ is_loading, message = "" }) => {
      onSetLoading(is_loading, message);
      return { success: true };
    },
    render: ({ args, status }) => (
      <div className="my-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
        {status === "executing" || args?.is_loading ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 flex-shrink-0" />
        ) : (
          <span className="text-blue-500 text-xs">✓</span>
        )}
        <span className="text-xs text-blue-800 font-medium">
          {args?.message || (args?.is_loading ? "Loading…" : "Ready")}
        </span>
      </div>
    ),
  });

  // ── Tool 2: update_dashboard ─────────────────────────────────────────────
  // Agent calls this after generating a full dashboard payload.
  // Handler lifts data up to page.tsx → Dashboard re-renders with new charts/KPIs.
  useFrontendTool({
    name: "update_dashboard",
    description: "Update the dashboard with AI-generated data, title, insights, and active page.",
    parameters: [
      { name: "dashboard_data", type: "object", description: "Full dashboard payload with all pages",    required: true  },
      { name: "title",          type: "string", description: "Dashboard title to show in the header",    required: true  },
      { name: "insights",       type: "object", description: "Array of AI insight strings",              required: false },
      { name: "active_page",    type: "number", description: "Page number to show after update (1-6)",  required: false },
    ],
    handler: async ({ dashboard_data, title, insights = [], active_page = 1 }) => {
      onUpdateDashboard({ dashboard_data, title, insights, active_page });
      return { success: true, message: `Dashboard "${title}" updated.` };
    },
    render: ({ args, status }) => (
      <div className="my-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
        {status === "executing" ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600" />
            <span className="text-sm font-medium text-indigo-800">Building dashboard…</span>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-indigo-900">
              ✅ Dashboard ready — <span className="font-bold">{args?.title}</span>
            </p>
            {Array.isArray(args?.insights) && args.insights.length > 0 && (
              <ul className="mt-2 space-y-1">
                {(args.insights as string[]).map((ins, i) => (
                  <li key={i} className="text-xs text-indigo-700">• {ins}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    ),
  });

  // ── Tool 3: navigate_to_page ─────────────────────────────────────────────
  // Agent calls this when user says "go to sales", "show products", etc.
  useFrontendTool({
    name: "navigate_to_page",
    description: "Switch the active dashboard tab to a specific page number (1-6).",
    parameters: [
      {
        name: "page",
        type: "number",
        description: "Page number: 1=Executive, 2=Sales, 3=Products, 4=Marketing, 5=Customers, 6=Operations",
        required: true,
      },
    ],
    handler: async ({ page }) => {
      const pageNum = Number(page);
      if (pageNum >= 1 && pageNum <= 6) {
        onNavigate(pageNum);
        return { success: true, navigated_to: pageNum };
      }
      return { success: false, error: "Invalid page number" };
    },
    render: ({ args }) => {
      const names = ["","Executive Summary","Sales Performance","Product Analytics","Marketing","Customer Insights","Operations"];
      const p = Number(args?.page ?? 1);
      return (
        <div className="my-2 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg flex items-center gap-2">
          <span className="text-violet-600">🧭</span>
          <span className="text-sm text-violet-800 font-medium">
            Navigated to <strong>{names[p] ?? `Page ${p}`}</strong>
          </span>
        </div>
      );
    },
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className={`fixed ${
        isMaximized
          ? "top-4 bottom-4 left-4 right-4"
          : isMinimized
          ? "bottom-6 right-6 w-[500px] h-16"
          : "bottom-6 right-6 w-[500px] h-[700px]"
      } bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#787CD8] to-[#9B9EE8] text-white px-5 py-3 rounded-t-2xl flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="font-bold text-base">AI Dashboard Assistant</h3>
          <p className="text-[11px] text-white/70">Generate dashboards &amp; navigate pages</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => { setIsMinimized(!isMinimized); if (isMaximized) setIsMaximized(false); }}
            className="w-7 h-7 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors" title={isMinimized ? "Restore" : "Minimize"}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMinimized
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />}
            </svg>
          </button>
          <button onClick={() => { setIsMaximized(!isMaximized); setIsMinimized(false); }}
            className="w-7 h-7 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors" title={isMaximized ? "Restore" : "Maximize"}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMaximized
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />}
            </svg>
          </button>
          <button onClick={onClose}
            className="w-7 h-7 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors" title="Close">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat body */}
      {!isMinimized && (
        <div className="flex-1 overflow-hidden bg-[#E8E6FF]">
          <CopilotChat
            className="h-full copilot-chat-custom"
            labels={{
              initial:
                "Hi! 👋 I'm your AI Business Dashboard Assistant.\n\n" +
                "I can:\n" +
                "• **Generate** a full 6-page business dashboard\n" +
                "• **Navigate** to any page (e.g. *'go to sales'*)\n" +
                "• **Update** the dashboard with fresh data\n\n" +
                "Try: *Generate a comprehensive business dashboard*",
            }}
            instructions={
              "You are a business analytics AI connected to a live dashboard.\n\n" +
              "For generate/create/update/refresh requests: call set_loading(true), then update_dashboard with full data, then set_loading(false).\n" +
              "For navigation requests (go to X, show X, navigate to X): call navigate_to_page with the correct page number.\n" +
              "Page numbers: 1=Executive Summary, 2=Sales, 3=Products, 4=Marketing, 5=Customers, 6=Operations.\n" +
              "Always call the correct frontend tool — never just describe what you would do."
            }
          />
        </div>
      )}

      <style jsx global>{`
        .copilot-chat-custom { background-color: #E8E6FF !important; height: 100%; }
        .copilot-chat-custom [class*="messages"], .copilot-chat-custom [class*="Messages"] { background-color: #E8E6FF !important; }
        .copilot-chat-custom [class*="user"], .copilot-chat-custom [class*="User"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important; border-radius: 18px !important; padding: 10px 14px !important;
        }
        .copilot-chat-custom [class*="assistant"], .copilot-chat-custom [class*="Assistant"] {
          background-color: white !important; color: #1f2937 !important;
          border-radius: 18px !important; padding: 10px 14px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,.08) !important;
        }
        .copilot-chat-custom textarea, .copilot-chat-custom input[type="text"] {
          background-color: white !important; border: 2px solid #c7d2fe !important; border-radius: 12px !important;
        }
        .copilot-chat-custom button[type="submit"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important; border-radius: 10px !important; font-weight: 600 !important;
        }
        .copilot-chat-custom p { margin: 2px 0 !important; line-height: 1.5 !important; }
        .copilot-chat-custom ::-webkit-scrollbar { width: 6px; }
        .copilot-chat-custom ::-webkit-scrollbar-thumb { background: #787CD8; border-radius: 10px; }
      `}</style>
    </div>
  );
}