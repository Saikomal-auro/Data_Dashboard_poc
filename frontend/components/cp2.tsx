"use client";

import React, { useState } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import type { WindowProps } from "@copilotkit/react-ui";

interface ChatPopupProps {
  onClose: () => void;
  onDashboardGenerated: (data: {
    title: string;
    payload: any;
  }) => void;
}

export default function ChatPopup({
  onClose,
  onDashboardGenerated,
}: ChatPopupProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // 🔥 SINGLE DASHBOARD ACTION
  useCopilotAction({
    name: "generate_dashboard",
    description: "Generate a full data dashboard for the main page",
    parameters: [
      { name: "title", type: "string", required: true },
      { name: "payload", type: "object", required: true },
    ],
    handler: async ({ title, payload }) => {
      onDashboardGenerated({ title, payload });
    },
    render: ({ args }) => (
      <div className="my-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm font-medium text-green-800">
          ✅ Dashboard generated
        </p>
        <p className="text-xs text-green-700">
          {args?.title}
        </p>
      </div>
    ),
  });

  // Custom Header Component
  const CustomHeader = () => (
    <div className="bg-gradient-to-r from-[#787CD8] to-[#9B9EE8] text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
      <div>
        <h3 className="font-bold text-lg">AI Data Assistant</h3>
        <p className="text-xs text-white/80 mt-0.5">
          Generate dashboards & insights
        </p>
      </div>
      
      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setIsMinimized(!isMinimized);
            if (isMaximized) setIsMaximized(false);
          }}
          className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
          title={isMinimized ? "Restore" : "Minimize"}
        >
          {isMinimized ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          )}
        </button>

        <button
          onClick={() => {
            setIsMaximized(!isMaximized);
            setIsMinimized(false);
          }}
          className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
          title={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>

        <button
          onClick={onClose}
          className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
          title="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  // Custom Window Wrapper - Properly typed with WindowProps
  const CustomWindow: React.FC<WindowProps> = (props) => (
    <div 
      className={`fixed ${
        isMaximized 
          ? 'top-4 bottom-4 left-1/2 right-4' 
          : isMinimized 
          ? 'bottom-6 right-6 w-[500px] h-16' 
          : 'bottom-6 right-6 w-[500px] h-[700px]'
      } bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col transition-all duration-300`}
    >
      <CustomHeader />
      
      {/* Chat Interface - Hidden when minimized */}
      {!isMinimized && (
        <div className="flex-1 overflow-hidden bg-[#E8E6FF]">
          {props.children}
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .copilot-chat {
          height: 100%;
          background: #E8E6FF;
        }
        
        .copilot-chat-messages {
          background: #E8E6FF;
        }
        
        .copilot-chat-input {
          background: white;
          border-top: 1px solid #d1d5db;
        }
      `}</style>
    </div>
  );

  return (
    <CopilotPopup
      instructions="
You are a data analysis assistant.
Always generate a full dashboard using generate_dashboard.
Do not generate individual charts or tables.
"
      defaultOpen={true}
      clickOutsideToClose={false}
      hitEscapeToClose={false}
      labels={{
        title: "AI Data Assistant",
        initial: "Hi! I can help you generate dashboards and insights.",
      }}
      Window={CustomWindow}
    />
  );
}