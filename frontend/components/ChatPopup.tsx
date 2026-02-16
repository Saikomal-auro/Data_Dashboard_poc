"use client";

import React, { useState } from "react";
import { useFrontendTool } from "@copilotkit/react-core"; // ← Changed from useCopilotAction
import { CopilotChat } from "@copilotkit/react-ui";

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

  // 🔥 UPDATED TO MODERN API
  useFrontendTool({
    name: "generate_dashboard",
    description: "Generate a full data dashboard for the main page with charts, metrics, and insights",
    parameters: [
      { 
        name: "title", 
        type: "string",
        description: "The title/name of the dashboard",
        required: true 
      },
      { 
        name: "payload", 
        type: "object",
        description: "Dashboard configuration including charts, data, and layout",
        required: true 
      },
    ],
    handler: async ({ title, payload }) => {
      onDashboardGenerated({ title, payload });
      return { success: true, title }; // Return value for better tracking
    },
    render: ({ args, status }) => (
      <div className="my-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm font-medium text-green-800">
          ✅ Dashboard generated
        </p>
        <p className="text-xs text-green-700">
          {args?.title}
        </p>
        {status === "executing" && (
          <p className="text-xs text-green-600 mt-1 animate-pulse">
            Generating...
          </p>
        )}
      </div>
    ),
  });

  return (
    <div 
      className={`fixed ${
        isMaximized 
          ? 'top-4 bottom-4 left-1/2 right-4' 
          : isMinimized 
          ? 'bottom-6 right-6 w-[500px] h-16' 
          : 'bottom-6 right-6 w-[500px] h-[700px]'
      } bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col transition-all duration-300`}
    >
      {/* Custom Header */}
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

      {/* Chat Interface - Hidden when minimized */}
      {!isMinimized && (
        <div className="flex-1 overflow-hidden bg-[#E8E6FF]">
          <CopilotChat
            className="h-full copilot-chat-custom"
             labels={{
initial: "Hello! I'm your AI Business Intelligence Assistant.\nI generate executive dashboards, sales analytics, product performance reports, and KPI summaries with real-time insights.\n\nTry asking:\n- Generate a comprehensive business dashboard\n- Show revenue trends for this year\n- Create a sales performance overview\n- What are the key highlights?",
            }}
            instructions="You are a data analysis assistant. Always generate a full dashboard using the generate_dashboard tool. Do not generate individual charts or tables - combine everything into one comprehensive dashboard."
          />
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


        /* Override CopilotKit default styles */
        .copilot-chat-custom {
          background-color: #E8E6FF !important;
        }

        /* Style the messages container */
        .copilot-chat-custom [class*="messages"] {
          background-color: #E8E6FF !important;
        }

        /* Style user messages */
        .copilot-chat-custom [class*="user"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          border-radius: 18px !important;
          padding: 12px 16px !important;
        }

        /* Style assistant messages */
        .copilot-chat-custom [class*="assistant"] {
          background-color: white !important;
          color: #1f2937 !important;
          border-radius: 18px !important;
          padding: 12px 16px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        /* Style the input area */
        .copilot-chat-custom [class*="input"] {
          background-color: white !important;
          border: 2px solid #c7d2fe !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
        }

        .copilot-chat-custom [class*="input"]:focus {
          border-color: #787CD8 !important;
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(120, 124, 216, 0.1) !important;
        }

        /* Style the send button */
        .copilot-chat-custom button[type="submit"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          border-radius: 10px !important;
          padding: 10px 20px !important;
          font-weight: 600 !important;
          transition: all 0.2s !important;
        }

        .copilot-chat-custom button[type="submit"]:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 4px 12px rgba(120, 124, 216, 0.4) !important;
        }

        .copilot-chat-custom p {
        margin: 2px 0 !important;
  line-height: 1.5 !important;
}



        /* Style the textarea container */
        .copilot-chat-custom [class*="textarea-container"] {
          background-color: transparent !important;
          padding: 16px !important;
        }

        /* Scrollbar styling */
        .copilot-chat-custom ::-webkit-scrollbar {
          width: 8px;
        }

        .copilot-chat-custom ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .copilot-chat-custom ::-webkit-scrollbar-thumb {
          background: #787CD8;
          border-radius: 10px;
        }

        .copilot-chat-custom ::-webkit-scrollbar-thumb:hover {
          background: #5f63b8;
        }
      `}</style>
    </div>
  );
}