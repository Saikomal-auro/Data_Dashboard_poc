"""
Dashboard Generation Agent using LangGraph and CopilotKit
FIXED: Proper MessagesState integration and tool definitions
"""
import os
import json
import random
from datetime import datetime, timedelta
from typing import Annotated, List, Dict, Any
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, END, MessagesState
from langgraph.graph.message import add_messages
from langchain_openai import AzureChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage
from langchain_core.tools import tool

# ============================================================================
# DATA GENERATORS
# ============================================================================

class DashboardDataGenerator:
    """Generate realistic dashboard data based on user requests"""
    
    @staticmethod
    def generate_revenue_data(months: int = 12) -> List[Dict]:
        """Generate revenue trend data"""
        base_revenue = 145000
        data = []
        for i in range(months):
            month = (datetime.now() - timedelta(days=30 * (months - i - 1))).strftime("%b")
            revenue = base_revenue + random.randint(10000, 30000) + (i * 5000)
            costs = revenue * random.uniform(0.6, 0.75)
            profit = revenue - costs
            forecast = revenue * random.uniform(1.05, 1.15)
            
            data.append({
                "month": month,
                "revenue": round(revenue),
                "costs": round(costs),
                "profit": round(profit),
                "forecast": round(forecast)
            })
        return data
    
    @staticmethod
    def generate_regional_sales() -> List[Dict]:
        """Generate regional sales distribution"""
        regions = [
            {"region": "North America", "revenue": 850000, "growth": 12.5},
            {"region": "Europe", "revenue": 620000, "growth": 8.3},
            {"region": "Asia Pacific", "revenue": 540000, "growth": 15.7},
            {"region": "Latin America", "revenue": 280000, "growth": 6.2},
            {"region": "Middle East", "revenue": 190000, "growth": 9.8}
        ]
        return regions
    
    @staticmethod
    def generate_product_performance() -> List[Dict]:
        """Generate product performance data"""
        products = [
            {"sku": "PROD-001", "name": "Premium Suite", "revenue": 425000, "units": 1200, "margin": 38},
            {"sku": "PROD-002", "name": "Standard Package", "revenue": 380000, "units": 2100, "margin": 32},
            {"sku": "PROD-003", "name": "Basic Plan", "revenue": 290000, "units": 3500, "margin": 28},
            {"sku": "PROD-004", "name": "Enterprise", "revenue": 520000, "units": 450, "margin": 42},
            {"sku": "PROD-005", "name": "Starter", "revenue": 165000, "units": 4200, "margin": 25}
        ]
        return products
    
    @staticmethod
    def generate_kpis() -> List[Dict]:
        """Generate KPI metrics"""
        return [
            {"metric": "Total Revenue", "value": 2283000, "format": "currency", "change": 15.3},
            {"metric": "Net Profit", "value": 685000, "format": "currency", "change": 12.7},
            {"metric": "Active Customers", "value": 12847, "format": "number", "change": 8.4},
            {"metric": "Avg Order Value", "value": 178, "format": "currency", "change": 5.2},
            {"metric": "Conversion Rate", "value": 3.8, "format": "percent", "change": 0.5},
            {"metric": "Customer LTV", "value": 2450, "format": "currency", "change": 11.2}
        ]
    
    @staticmethod
    def generate_quarterly_data() -> List[Dict]:
        """Generate quarterly comparison data"""
        return [
            {"quarter": "Q1 2024", "revenue": 425000, "profit": 127500, "expenses": 297500},
            {"quarter": "Q2 2024", "revenue": 465000, "profit": 142650, "expenses": 322350},
            {"quarter": "Q3 2024", "revenue": 510000, "profit": 158100, "expenses": 351900},
            {"quarter": "Q4 2024", "revenue": 555000, "profit": 177600, "expenses": 377400}
        ]
    
    @staticmethod
    def generate_customer_segments() -> List[Dict]:
        """Generate customer segment data over time"""
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        data = []
        for month in months:
            data.append({
                "month": month,
                "enterprise": random.randint(45000, 75000),
                "midMarket": random.randint(35000, 55000),
                "smallBusiness": random.randint(25000, 45000)
            })
        return data


# ============================================================================
# FRONTEND TOOLS (for CopilotKit AGUI)
# ============================================================================

@tool
def set_dashboard_data(dashboard_data: dict, insights: list = None):
    """
    Update the frontend dashboard with new AI-generated data.
    
    Args:
        dashboard_data: Complete dashboard data structure with pages and sections
        insights: Optional list of AI-generated insights
    """
    return {
        "success": True,
        "dashboard_data": dashboard_data,
        "insights": insights or []
    }

# ============================================================================
# FRONTEND TOOLS (for CopilotKit AGUI)
# ============================================================================

@tool
def set_dashboard_data(data: dict):
    """
    Set the complete dashboard data structure in the frontend.
    This updates the entire dashboard with AI-generated pages and sections.
    
    Args:
        data: Complete dashboard data with structure:
              { pages: { executive: {...}, sales: {...}, products: {...} }, 
                metadata: {...} }
    """
    return {
        "success": True,
        "data": data,
        "pagesLoaded": len(data.get("pages", {}))
    }

@tool
def update_generation_status(status: str, isGenerating: bool = None):
    """
    Update the dashboard generation status message.
    
    Args:
        status: Status message to display
        isGenerating: Whether generation is in progress
    """
    return {"success": True, "status": status}

@tool
def navigate_to_page(page: int):
    """
    Navigate to a specific dashboard page.
    
    Args:
        page: Page number (1=Executive, 2=Sales, 3=Product, 4=Marketing, 5=Customer, 6=Operations)
    """
    if 1 <= page <= 6:
        return {"success": True, "page": page}
    return {"success": False, "error": "Invalid page number"}

# ============================================================================
# AGENT NODE
# ============================================================================

def dashboard_agent_node(state: MessagesState) -> MessagesState:
    """
    Main agent node that processes user requests and generates dashboard data
    """
    # Initialize LLM
    llm = AzureChatOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT", "https://model-gpt-ap001.openai.azure.com"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY_GPT4_1"),
        api_version="2025-01-01-preview",
        deployment_name="gpt-4.1-mini",
        temperature=0.7
    )
    
    # Bind tools to LLM
    llm_with_tools = llm.bind_tools([
        set_dashboard_data, 
        update_generation_status,
        navigate_to_page
    ])
    
    # Initialize data generator
    data_generator = DashboardDataGenerator()
    
    # Get messages from state
    messages = state["messages"]
    
    # Get last user message
    last_message = messages[-1] if messages else None
    if not last_message or not isinstance(last_message, HumanMessage):
        return state
    
    user_query = last_message.content

    user_query_lower = user_query.lower() 
    if user_query_lower in ["hi", "hello", "hey"] or user_query_lower.startswith("hi"):
        return {

        "messages": [
            AIMessage(
                content="Hi 👋 I can generate business dashboards for you."
            )
        ]
    }
    # Help handling
    if "help" in user_query_lower:
        return {
        "messages": [
            AIMessage(
                content="I can generate business dashboards including:\n\n"
                        "- Executive Summary\n"
                        "- Sales Performance\n"
                        "- Product Analytics\n\n"
                        "Try asking: 'Generate a sales dashboard'"
            )
        ]
    }

    dashboard_keywords = [
    "dashboard",
    "generate",
    "create",
    "analysis",
    "revenue",
    "sales",
    "product"
]

    if not any(keyword in user_query_lower for keyword in dashboard_keywords):
        return {
        "messages": [
            AIMessage(
                content="I can generate dashboards for you. "
                        "Try saying 'Generate a revenue dashboard'."
            )
        ]
    }

    # Step 1: Analyze query
    analysis_prompt = f"""You are a business analytics assistant. 
    Analyze this query and determine what dashboard data to generate: "{user_query}"
    
    Respond with JSON:
    {{
        "data_type": "executive|sales|products",
        "time_range": "monthly|quarterly|yearly",
        "metrics": ["revenue", "profit", etc],
        "insights_needed": true|false
    }}
    """
    
    analysis_response = llm.invoke([SystemMessage(content=analysis_prompt)])
    
    try:
        analysis = json.loads(analysis_response.content)
    except:
        analysis = {
            "data_type": "executive",
            "time_range": "monthly",
            "metrics": ["revenue", "profit", "customers"],
            "insights_needed": True
        }
    
    # Step 2: Generate dashboard data
    dashboard_data = {
        "timestamp": datetime.now().isoformat(),
        "pages": {}
    }
    
    # Generate Executive Summary
    dashboard_data["pages"]["executive"] = {
        "pageNumber": 1,
        "pageTitle": "Executive Summary",
        "sections": [
            {
                "sectionTitle": "Key Performance Indicators",
                "data": {"kpis": data_generator.generate_kpis()}
            },
            {
                "sectionTitle": "Revenue Trend Analysis",
                "description": "12-month revenue, costs, profit and forecast",
                "data": {"timeSeries": data_generator.generate_revenue_data()}
            },
            {
                "sectionTitle": "Quarterly Performance Comparison",
                "description": "Revenue, profit and expenses by quarter",
                "data": {"quarters": data_generator.generate_quarterly_data()}
            }
        ]
    }
    
    # Generate Sales Performance
    dashboard_data["pages"]["sales"] = {
        "pageNumber": 2,
        "pageTitle": "Sales Performance",
        "sections": [
            {
                "sectionTitle": "Regional Sales Distribution",
                "description": "Revenue breakdown by geographic region",
                "data": {"regions": data_generator.generate_regional_sales()}
            },
            {
                "sectionTitle": "Customer Segments Over Time",
                "description": "Monthly revenue by customer segment",
                "data": {"segments": data_generator.generate_customer_segments()}
            }
        ]
    }
    
    # Generate Product Performance
    dashboard_data["pages"]["products"] = {
        "pageNumber": 3,
        "pageTitle": "Product Analytics",
        "sections": [
            {
                "sectionTitle": "Product Performance Metrics",
                "description": "Revenue, units sold, and margin by product",
                "data": {"products": data_generator.generate_product_performance()}
            }
        ]
    }
    
    # Step 3: Generate insights
    data_summary = json.dumps(dashboard_data, indent=2)[:2000]
    insights_prompt = f"""Analyze this dashboard data and provide 3-5 key insights.
    Format as JSON array of strings.
    
    Data: {data_summary}"""
    
    insights_response = llm.invoke([SystemMessage(content=insights_prompt)])
    
    try:
        insights = json.loads(insights_response.content)
    except:
        insights = [
            "Revenue shows consistent upward trend with 15.3% YoY growth",
            "Enterprise segment outperforming with 42% profit margin",
            "Q4 2024 performance exceeded targets by 8.5%"
        ]
    
    # Step 4: Call tool to update frontend
    tool_call_response = llm_with_tools.invoke([
        SystemMessage(content="Call the update_dashboard_data tool with the generated data"),
        HumanMessage(content=json.dumps({
            "dashboard_data": dashboard_data,
            "insights": insights
        }))
    ])
    
    # Create response message with tool calls
    response_content = f"I've generated a comprehensive dashboard with insights:\n\n" + \
                      "\n".join(f"• {insight}" for insight in insights)
    
    response_message = AIMessage(
        content=response_content,
        tool_calls=[{
            "name": "set_dashboard_data",
            "args": {
                "dashboard_data": dashboard_data,
                "insights": insights
            },
            "id": "call_dashboard_update"
        }]
    )
    
    return {"messages": [response_message]}


# ============================================================================
# GRAPH CONSTRUCTION
# ============================================================================

def create_dashboard_graph():
    """Create the LangGraph workflow for dashboard generation"""
    
    workflow = StateGraph(MessagesState)
    
    # Add single agent node
    workflow.add_node("agent", dashboard_agent_node)
    
    # Simple flow: entry -> agent -> end
    workflow.set_entry_point("agent")
    workflow.add_edge("agent", END)
    memory = MemorySaver()

    
    # Compile
    return workflow.compile(checkpointer=memory)


# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == "__main__":
    graph = create_dashboard_graph()
    
    initial_state = {
        "messages": [
            HumanMessage(content="Generate a comprehensive business dashboard with revenue analysis")
        ]
    }
    
    result = graph.invoke(initial_state)
    print("Agent response:", result["messages"][-1].content)