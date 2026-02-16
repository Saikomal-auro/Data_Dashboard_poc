"""
CopilotKit Backend Server
Integrates LangGraph agent with CopilotKit's shared state management
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from copilotkit import CopilotKitSDK,  LangGraphAGUIAgent
from copilotkit.langchain import copilotkit_customize_config
from dashboard_agent import create_dashboard_graph
import os
from dotenv import load_dotenv
from ag_ui_langgraph import add_langgraph_fastapi_endpoint

load_dotenv()

# ============================================================================
# FASTAPI APP SETUP
# ============================================================================

app = FastAPI(
    title="Dashboard Agent API",
    description="AI-powered dashboard generation with CopilotKit and LangGraph",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# COPILOTKIT SDK SETUP
# ============================================================================


# ✅ Create AGUI agent directly
dashboard_agent = LangGraphAGUIAgent(
    name="dashboard_agent",
    description="Generates and analyzes business dashboards",
    graph=create_dashboard_graph(),
)

# ✅ Add CopilotKit endpoint (NO SDK)
add_langgraph_fastapi_endpoint(
    app=app,
    agent=dashboard_agent,
    path="/copilotkit",
)


# ============================================================================
# ROUTES
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Dashboard Agent API",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "ok",
        "agents": ["dashboard_agent"],
        "capabilities": [
            "dashboard_generation",
            "data_analysis",
            "insight_generation"
        ]
    }




# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    
    print(f"""
    ╔════════════════════════════════════════════════╗
    ║   Dashboard Agent API Server                   ║
    ║   Running on http://localhost:{port}            ║
    ╚════════════════════════════════════════════════╝
    
    CopilotKit endpoint: http://localhost:{port}/copilotkit
    Health check: http://localhost:{port}/health
    """)
    
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )