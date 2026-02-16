"use client";
import React, { useState } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import TableVisualization from "./TableVisualization";
import ChartVisualization from "./ChartVisualization";

interface ChatPopupProps {
  onClose: () => void;
  onVisualizationGenerated: (data: any) => void;
}

// Visualization/SQL Toggle Component
function VisualizationSqlToggle({ 
  sqlQuery, 
  children 
}: { 
  sqlQuery: string | null; 
  children: React.ReactNode;
}) {
  const [showSql, setShowSql] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sqlQuery || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Check if we actually have a valid SQL query
  const hasValidSql = sqlQuery && sqlQuery.trim() !== '' && sqlQuery !== 'undefined';

  if (!hasValidSql) {
    // No SQL query - just show visualization
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-3">
        {children}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-3">
      {/* Toggle Header */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-600">
            {showSql ? 'SQL Query' : 'Visualization'}
          </span>
          <button
            onClick={() => setShowSql(!showSql)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              showSql 
                ? 'bg-purple-600 focus:ring-purple-500' 
                : 'bg-blue-500 focus:ring-blue-500'
            }`}
            aria-label={showSql ? "Switch to visualization" : "Switch to SQL query"}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-md ${
                showSql ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-xs text-gray-400">
            {showSql ? 'View Visualization' : 'View SQL'}
          </span>
        </div>
        
        {showSql && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors shadow-sm"
          >
            <span>{copied ? '✅' : '📋'}</span>
            <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
          </button>
        )}
      </div>

      {/* Content Display */}
      {showSql ? (
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
          <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span className="text-green-400 text-xs font-mono font-semibold uppercase tracking-wide">
              SQL Query
            </span>
          </div>
          <div className="p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap break-words leading-relaxed">
              {sqlQuery}
            </pre>
          </div>
        </div>
      ) : (
        <div>
          {children}
        </div>
      )}
    </div>
  );
}

export default function ChatPopup({ onClose, onVisualizationGenerated }: ChatPopupProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Register table generation action
  useCopilotAction({
    name: "generate_table",
    description: "Display a table in the chat and on the main page",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Table title",
        required: true,
      },
      {
        name: "headers",
        type: "string[]",
        description: "Column headers",
        required: true,
      },
      {
        name: "rows",
        type: "object[]",
        description: "Table rows as array of objects with string values",
        required: true,
      },
      {
        name: "sqlQuery",
        type: "string",
        description: "The SQL query used to generate this data (optional)",
        required: false,
      },
      {
        name: "explanation",
        type: "string",
        description: "A brief text explanation of what the table shows",
        required: false,
      },
    ],
    handler: async ({ title, headers, rows, sqlQuery, explanation }) => {
      console.log("====================================");
      console.log("🔧 TABLE HANDLER CALLED");
      console.log("====================================");
      console.log("📊 Title:", title);
      console.log("📊 Raw sqlQuery received:", sqlQuery);
      console.log("📊 Explanation:", explanation);
      
      // Normalize SQL query - convert undefined/empty to null
      const normalizedSql = (sqlQuery && sqlQuery.trim() !== '' && sqlQuery !== 'undefined') 
        ? sqlQuery.trim() 
        : null;
      
      onVisualizationGenerated({
        type: 'table',
        title,
        headers,
        rows,
        sqlQuery: normalizedSql,
        explanation: explanation || `This table shows ${title.toLowerCase()}.`
      });
      
      console.log("✅ Final sqlQuery:", normalizedSql ? "HAS SQL" : "NO SQL");
      console.log("====================================\n");
    },
    render: ({ args }) => {
      if (!args.title || !args.headers || !args.rows) {
        return <div className="text-gray-500 text-sm">⏳ Loading table...</div>;
      }

      // Normalize SQL query
      const sqlQuery = (args.sqlQuery && args.sqlQuery.trim() !== '' && args.sqlQuery !== 'undefined') 
        ? args.sqlQuery.trim() 
        : null;
      
      const willDisplayOnMainPage = args.rows.length > 5;

      return (
        <div className="my-4">
          {willDisplayOnMainPage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-800 font-medium">Table displayed on main page</p>
            </div>
          )}
          
          <VisualizationSqlToggle sqlQuery={sqlQuery}>
            <TableVisualization 
              title={args.title} 
              headers={args.headers} 
              rows={args.rows} 
              enableScrolling={true}
            />
          </VisualizationSqlToggle>
        </div>
      );
    },
  });

  // Register chart generation action
  useCopilotAction({
    name: "generate_chart",
    description: "Display a chart in the chat and on the main page",
    parameters: [
      {
        name: "chartType",
        type: "string",
        description: "Chart type: line, bar, pie, area",
        required: true,
      },
      {
        name: "title",
        type: "string",
        description: "Chart title",
        required: true,
      },
      {
        name: "data",
        type: "object[]",
        description: "Chart data as array of objects",
        required: true,
      },
      {
        name: "xKey",
        type: "string",
        description: "X-axis key",
        required: true,
      },
      {
        name: "yKey",
        type: "string",
        description: "Y-axis key",
        required: true,
      },
      {
        name: "sqlQuery",
        type: "string",
        description: "The SQL query used to generate the chart data (optional)",
        required: false,
      },
      {
        name: "explanation",
        type: "string",
        description: "A brief text explanation of what the chart shows",
        required: false,
      },
    ],
    handler: async ({ chartType, title, data, xKey, yKey, sqlQuery, explanation }) => {
      console.log("====================================");
      console.log("🔧 CHART HANDLER CALLED");
      console.log("====================================");
      console.log("📈 Title:", title);
      console.log("📈 Raw sqlQuery received:", sqlQuery);
      console.log("📈 Explanation:", explanation);
      
      // Normalize SQL query - convert undefined/empty to null
      const normalizedSql = (sqlQuery && sqlQuery.trim() !== '' && sqlQuery !== 'undefined') 
        ? sqlQuery.trim() 
        : null;
      
      onVisualizationGenerated({
        type: 'chart',
        chartType,
        title,
        data,
        xKey,
        yKey,
        sqlQuery: normalizedSql,
        explanation: explanation || `This ${chartType} chart shows ${title.toLowerCase()}.`
      });
      
      console.log("✅ Final sqlQuery:", normalizedSql ? "HAS SQL" : "NO SQL");
      console.log("====================================\n");
    },
    render: ({ args }) => {
      if (!args.chartType || !args.title || !args.data || !args.xKey || !args.yKey) {
        return <div className="text-gray-500 text-sm">⏳ Loading chart...</div>;
      }

      // Normalize SQL query
      const sqlQuery = (args.sqlQuery && args.sqlQuery.trim() !== '' && args.sqlQuery !== 'undefined') 
        ? args.sqlQuery.trim() 
        : null;
      
      const willDisplayOnMainPage = args.data.length > 5;

      return (
        <div className="my-4">
          {willDisplayOnMainPage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-800 font-medium">Chart displayed on main page</p>
            </div>
          )}
          
          <VisualizationSqlToggle sqlQuery={sqlQuery}>
            <ChartVisualization 
              chartType={args.chartType}
              title={args.title}
              data={args.data}
              xKey={args.xKey}
              yKey={args.yKey}
            />
          </VisualizationSqlToggle>
        </div>
      );
    },
  });

  return (
    <div 
      className={`fixed bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 z-50 ${
        isMinimized 
          ? 'bottom-6 right-6 w-100 h-16' 
          : isMaximized 
            ? 'top-6 right-6 bottom-6 w-[900px]' 
            : 'bottom-6 right-6 w-[500px] h-[700px]'
      }`}
    >
      {/* Header */}
      <div className="bg-[#787CD8] text-white px-6 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E8E6FF] rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-[#787CD8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">AI Data Assistant</h3>
            <p className="text-xs text-white/90">Generate tables, charts & insights</p>
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setIsMinimized(!isMinimized);
              if (isMaximized) setIsMaximized(false);
            }}
            className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
            aria-label={isMinimized ? "Restore" : "Minimize"}
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
            aria-label={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
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
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      {!isMinimized && (
        <div className="flex-1 overflow-hidden bg-[#E8E6FF]">
          <CopilotChat
            className="h-full copilot-chat-custom"
            labels={{
              initial: "Hello! It's great to hear from you! I'm here to help you with your sales data, including leads, quotations, sales orders, schedules, and dispatches. How can I assist you today?",
            }}
            instructions="You are a data analysis assistant. Help users create tables and charts. Use the generate_table action to create tables and generate_chart action to create visualizations. 

CRITICAL INSTRUCTIONS:
1. When you generate a table or chart, provide ONLY a brief 1-sentence summary before the visualization
2. Do NOT repeat the data after showing the visualization - it speaks for itself
3. When using SQL queries, ALWAYS provide them in the 'sqlQuery' parameter so users can toggle between explanation and SQL
4. Keep explanations concise and focused on insights, not just data repetition"
          />
        </div>
      )}

      {/* Styles */}
      <style jsx global>{`
        .copilot-chat-custom {
          background-color: #E8E6FF !important;
        }
        .copilot-chat-custom [class*="messages"] {
          background-color: #E8E6FF !important;
        }
        .copilot-chat-custom [class*="user"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          border-radius: 18px !important;
          padding: 12px 16px !important;
        }
        .copilot-chat-custom [class*="assistant"] {
          background-color: white !important;
          color: #1f2937 !important;
          border-radius: 18px !important;
          padding: 12px 16px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }
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
      `}</style>
    </div>
  );
}