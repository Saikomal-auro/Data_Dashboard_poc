import os
import json
import re
import uvicorn
import uuid
from typing import Annotated, Literal, TypedDict, List, Dict, Optional, Any
from langgraph.graph import StateGraph, END, START, MessagesState
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import AzureChatOpenAI
# from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from ag_ui_langgraph import add_langgraph_fastapi_endpoint
from copilotkit import LangGraphAGUIAgent
from sql_agent import process_sql_query

load_dotenv()

# ============================================================================
# STATE DEFINITION
# ============================================================================

class ConversationState(TypedDict):
    """State for the conversation agent"""
    messages: Annotated[list, add_messages]
    user_query: str
    enhanced_query: str
    intent: str
    is_in_scope: bool
    scope_validation_result: str
    conversation_history: List[Dict[str, str]]
    sql_agent_response: Optional[Dict[str, Any]]
    response_format: str  # text, table, graph, text_table, text_graph
    final_response: str
    table_data: Optional[Dict]
    chart_data: Optional[Dict]
    chart_type: Optional[str]
    sql_query: str
    next_step: str
    reasoning_log: List[Dict[str, str]]


# ============================================================================
# LLM INITIALIZATION
# ============================================================================

llm = AzureChatOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT", "https://model-gpt-ap001.openai.azure.com"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY_GPT4_1"),
    api_version="2025-01-01-preview",
    deployment_name="gpt-4.1-mini",
    temperature=0
)

# from llm_config import get_llm

# llm = get_llm(temperature=0)

# ============================================================================
# BUSINESS CONTEXT (Sales Persona)
# ============================================================================

BUSINESS_CONTEXT = """
You are assisting SALES USERS (Sales Representatives, Managers, Branch Managers, Regional Managers, Sales Heads).

They work with these business concepts (they don't know database tables):
- **Leads**: Potential customers/prospects they're tracking
- **Quotations**: Price quotes sent to customers  
- **Sales Orders**: Confirmed customer orders
- **Schedules**: Delivery/dispatch schedules for orders
- **Dispatches**: Actual shipments sent to customers

Business Flow: Lead → Quotation → Sales Order → Schedule → Dispatch

Sales users speak in business terms like:
- "Show me my leads from last week"
- "Which quotations are pending approval?"
- "Get order details for customer ABC Corp"
- "What's the status of dispatch for order SO-123?"
- "Show me top performing customers this month"
"""


# ============================================================================
# AGENT NODES
# ============================================================================

def intent_and_scope_classifier(state: ConversationState) -> ConversationState:
    """
    Combined intent classification and scope validation
    Determines if query is in scope and what type of interaction it is
    """
    user_query = state["user_query"]
    history = state.get("conversation_history", [])
    
    # Build conversation context
    history_context = ""
    last_assistant_msg = ""
    if history:
        history_context = "\n".join([
            f"{msg['role'].upper()}: {msg['content']}" 
            for msg in history[-3:]
        ])
        for msg in reversed(history):
            if msg['role'] == 'assistant':
                last_assistant_msg = msg['content']
                break
    
    classification_prompt = f"""
You are analyzing a query from a SALES USER (not a technical user).

{BUSINESS_CONTEXT}

CONVERSATION HISTORY:
{history_context if history_context else "This is the first message"}

LAST ASSISTANT MESSAGE:
{last_assistant_msg if last_assistant_msg else "None"}

CURRENT USER QUERY:
"{user_query}"

YOUR TASK:
1. Determine if this query is IN SCOPE for sales/CRM data
2. Classify the intent

INTENT TYPES:
- **greeting**: Hi, hello, thanks, goodbye
- **help**: What can you do? How does this work? Capabilities questions
- **data_request**: User wants to retrieve sales/CRM data (NEW request)
- **follow_up**: Continuing previous topic, adding filters, or exploring related data

CLASSIFICATION GUIDELINES:
- If user starts with "show me", "get", "retrieve", "list" → likely **data_request**
- If user is adding context to previous query → likely **follow_up**
- Use conversation flow to understand intent

SCOPE RULES:
- IN SCOPE: Anything about leads, quotes, orders, schedules, dispatches, customers, sales metrics

RESPOND WITH JSON ONLY (no markdown):
{{
  "is_in_scope": true/false,
  "intent": "greeting | help | data_request | follow_up",
  "reasoning": "Brief explanation including conversation context analysis",
  "scope_message": "If out of scope, what to tell the user"
}}
"""
    
    response = llm.invoke([SystemMessage(content=classification_prompt)])
    response_text = response.content.strip()
    
    try:
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        parsed = json.loads(json_match.group(0) if json_match else response_text)
        
        state["is_in_scope"] = parsed.get("is_in_scope", True)
        state["intent"] = parsed.get("intent", "help")
        state["scope_validation_result"] = parsed.get("reasoning", "")
        
        if not state["is_in_scope"]:
            state["final_response"] = parsed.get("scope_message", 
                "I can only help with sales and CRM data.")
            state["next_step"] = "END"
        else:
            state["next_step"] = "query_enhancer" if state["intent"] in ["data_request", "follow_up"] else "conversation_handler"
        
    except Exception as e:
        print(f"Classification error: {e}")
        state["is_in_scope"] = True
        state["intent"] = "help"
        state["next_step"] = "conversation_handler"
    
    state["reasoning_log"].append({
        "agent": "intent_and_scope_classifier",
        "step": "Intent & Scope Classification",
        "reasoning": f"Intent: {state['intent']}, In Scope: {state['is_in_scope']}, {state['scope_validation_result']}"
    })
    
    return state


def conversation_handler(state: ConversationState) -> ConversationState:
    """
    Handles greetings, help requests, and general conversation
    """
    user_query = state["user_query"]
    intent = state["intent"]
    
    handler_prompt = f"""
You are a friendly AI assistant for a Sales CRM system.

{BUSINESS_CONTEXT}

USER QUERY: "{user_query}"
INTENT: {intent}

YOUR TASK:
Respond naturally to the user based on their intent.

IF GREETING:
- Greet warmly
- Briefly mention you help with sales data
- Ask how you can help

IF HELP REQUEST:
- Explain you provide access to:
  * Lead tracking and management
  * Quotation status and details  
  * Sales order information
  * Delivery schedules
  * Dispatch tracking
- Give 2-3 example questions they could ask
- Encourage them to ask naturally

Keep it conversational, friendly, and concise (2-4 sentences max).
"""
    
    response = llm.invoke([SystemMessage(content=handler_prompt)])
    state["final_response"] = response.content
    state["next_step"] = "END"
    
    state["reasoning_log"].append({
        "agent": "conversation_handler",
        "step": "Conversational Response",
        "reasoning": f"Handled {intent} with friendly response"
    })
    
    return state


def query_enhancer(state: ConversationState) -> ConversationState:
    """
    Enhances user query with context from conversation history
    Translates business language to data requirements
    PRESERVES aggregation intent (count, sum, average, etc.)
    """
    user_query = state["user_query"]
    intent = state["intent"]
    history = state.get("conversation_history", [])
    
    # Extract context from history
    previous_queries = []
    previous_clarifications = []
    
    for msg in history[-3:]:
        if msg['role'] == 'user':
            previous_queries.append(msg['content'])
        elif msg['role'] == 'assistant' and any(kw in msg['content'].lower() 
                                                for kw in ['specify', 'which', 'provide']):
            previous_clarifications.append(msg['content'])
    
    context_info = ""
    if intent in ["clarification_answer", "follow_up"] and previous_queries:
        context_info = f"""
PREVIOUS USER QUERY: {previous_queries[-1] if previous_queries else 'None'}
CLARIFICATION REQUESTED: {previous_clarifications[-1] if previous_clarifications else 'None'}
CURRENT USER INPUT: {user_query}
"""
    
    enhancement_prompt = f"""
Act like an expert Enterprise Analytics Translator and SQL Query Intent Designer specialized in Sales Operations and CRM systems.

Your goal is to transform a sales user's natural-language business question into a fully expanded, precise, and unambiguous analytical query specification that can be safely passed to a downstream SQL query builder agent.

BUSINESS CONTEXT:
{BUSINESS_CONTEXT}

{context_info if context_info else f"USER QUERY: {user_query}"}

CONVERSATION HISTORY:
{chr(10).join([f"{msg['role'].upper()}: {msg['content']}" for msg in history[-3:]]) if history else "No history"}

TASK:
Convert the sales user's natural-language query into a detailed, structured query specification following the EXACT FORMAT below.

INSTRUCTIONS (step-by-step):
1. Carefully interpret the user's natural-language input using only business terminology.
2. Identify the primary (main) business entity involved and any dependent or related entities.
3. Clearly state the analytical objective in one concise sentence (what decision or insight this query supports).
4. Define all metrics explicitly (e.g., COUNT, SUM, AVG), including what they measure and why.
5. Identify all properties/dimensions required (e.g., date, item, customer, month, status).
6. Translate all time references, thresholds, and conditions into explicit filter criteria.
7. Specify grouping logic (if any), ordering logic, and result limits.
8. If the user query is ambiguous, make reasonable business assumptions and state them explicitly rather than asking questions.
9. Do not mention database tables, SQL syntax, joins, or physical schema details.

CRITICAL RULES:

OUTPUT FORMAT (follow this EXACT structure):
Write a single comprehensive paragraph that includes ALL of the following components in order:

1. **Objective**: Start with "The objective is to [calculate/determine/retrieve]..." stating what the query aims to achieve.
2. **Main Entity**: State "The **main entity** is **[Entity Name]**, representing [brief description]."
3. **Dependent Entity** (if any): State "and the **dependent entity** is **[Entity Name]**, representing [brief description]."
4. **Metric**: State "The **metric** is **[metric name]** which [measures what and why]."
5. **Filter Criteria**: State "The **filter criteria** include [list all conditions with explicit values]."
6. **Grouping/Ordering** (if applicable): Include any grouping or ordering logic.

EXAMPLE OUTPUT:
"The objective is to calculate the **total number of sales orders** with the transaction type **"Taxable – Inter State"** that have at least **one associated schedule record**. The **main entity** is **Sales Orders**, representing confirmed customer sales transactions, and the **dependent entity** is **Schedules**, representing planning or execution records linked to sales orders. The **metric** is **sales order count** which measures how many inter-state taxable sales orders have progressed to the scheduling stage. The **filter criteria** include `transaction name = 'Taxable - Inter State'` and the **existence of a related schedule**."

IMPORTANT: Output ONLY the structured paragraph. Do not include any JSON, markdown headers, or additional formatting.
"""
    
    response = llm.invoke([SystemMessage(content=enhancement_prompt)])
    response_text = response.content.strip()
    
    try:
        # The response is now a plain paragraph, not JSON
        enhanced_query = response_text
        
        # Infer aggregation type from the enhanced query text
        enhanced_lower = enhanced_query.lower()
        if "count" in enhanced_lower or "number of" in enhanced_lower:
            aggregation_type = "count"
        elif "sum" in enhanced_lower or "total" in enhanced_lower:
            aggregation_type = "sum"
        elif "average" in enhanced_lower or "avg" in enhanced_lower or "mean" in enhanced_lower:
            aggregation_type = "average"
        elif "top" in enhanced_lower and any(char.isdigit() for char in enhanced_query):
            aggregation_type = "top_n"
        elif "records" in enhanced_lower or "details" in enhanced_lower or "list" in enhanced_lower:
            aggregation_type = "records"
        else:
            aggregation_type = "none"
        
        # SAFETY CHECK: Detect if LLM failed to preserve intent
        query_lower = user_query.lower()
        enhanced_lower = enhanced_query.lower()
        
        # CRITICAL: Check if previous query asked for RECORDS/DETAILS
        asked_for_records = False
        if previous_queries:
            prev_lower = previous_queries[-1].lower()
            asked_for_records = any(word in prev_lower for word in ["records", "details", "list", "show me"])
            # If previous query asked for records, current clarification should NOT become COUNT
            if asked_for_records and "count" in enhanced_lower and "count" not in query_lower:
                print(f"[OVERRIDE] Preventing COUNT conversion. User asked for RECORDS, not count!")
                enhanced_query = enhanced_query.replace("COUNT of", "RECORDS of")
                enhanced_query = enhanced_query.replace("NUMBER of", "RECORDS of")
                aggregation_type = "records"
        
        # Check if user explicitly wanted RECORDS/DETAILS but LLM changed to COUNT
        if any(word in query_lower for word in ["records", "details", "list", "show", "display"]):
            if "count" in enhanced_lower and "count" not in query_lower:
                print(f"[OVERRIDE] User asked for RECORDS/DETAILS, not COUNT. Original: '{user_query}'")
                enhanced_query = enhanced_query.replace("COUNT of", "RECORDS of")
                enhanced_query = enhanced_query.replace("NUMBER of", "RECORDS of")
                aggregation_type = "records"
        
        # Check if user wanted a count but enhanced query doesn't have it
        if any(word in query_lower for word in ["how many", "number of", "count of", "total count"]):
            if not any(word in enhanced_lower for word in ["count", "number"]):
                print(f"[OVERRIDE] Query enhancement lost COUNT intent. Original: '{user_query}'")
                # Force count preservation
                if "retrieve" in enhanced_lower:
                    enhanced_query = enhanced_query.replace("Retrieve lead records", "Retrieve the COUNT of leads")
                    enhanced_query = enhanced_query.replace("Retrieve order records", "Retrieve the COUNT of orders")
                    enhanced_query = enhanced_query.replace("Retrieve records", "Retrieve the COUNT")
                    aggregation_type = "count"
        
        # Check if user wanted sum/total but enhanced query doesn't have it
        if any(word in query_lower for word in ["total", "sum of"]) and "count" not in query_lower:
            if not any(word in enhanced_lower for word in ["total", "sum"]):
                print(f"[OVERRIDE] Query enhancement lost SUM/TOTAL intent. Original: '{user_query}'")
        
        # Check if user wanted average but enhanced query doesn't have it
        if any(word in query_lower for word in ["average", "mean", "avg"]):
            if not any(word in enhanced_lower for word in ["average", "mean", "avg"]):
                print(f"[OVERRIDE] Query enhancement lost AVERAGE intent. Original: '{user_query}'")
        
        state["enhanced_query"] = enhanced_query
        
        state["reasoning_log"].append({
            "agent": "query_enhancer",
            "step": "Query Enhancement",
            "reasoning": f"Enhanced query with aggregation type: {aggregation_type}",
            "enhanced_query_preview": enhanced_query[:150] + "..." if len(enhanced_query) > 150 else enhanced_query
        })
        
    except Exception as e:
        print(f"Enhancement error: {e}")
        state["enhanced_query"] = user_query
    
    state["next_step"] = "sql_agent_router"
    return state
    
def sql_agent_router(state: ConversationState) -> ConversationState:
    """
    Routes to SQL Agent to process the enhanced query
    Integrates with sql_agent module for NL2SQL processing using LangChain agent
    """
    enhanced_query = state["enhanced_query"]
   
    print(f"\n{'='*80}")
    print(f"🔄 SQL AGENT PROCESSING - Enhanced Query:")
    print(f"{'='*80}")
    print(f"{enhanced_query}")
    print(f"{'='*80}\n")
   
    # ============================================================================
    # INTEGRATED SQL AGENT CALL
    # Uses LangChain agent from sql_agent module
    # Returns: {status, sql_query, data, columns, response}
    # Note: response contains markdown blocks (```count```, ```filters```, ```sql```)
    #       for display purposes - do NOT parse row count from it
    # ============================================================================
   
    sql_agent_response = process_sql_query(enhanced_query, limit=20)
    # print(f"[SQL AGENT] Data Sample (first row): {sql_agent_response['data'][0] if sql_agent_response.get('data') else 'None'}")
    print(f"{'='*80}\n")
    print(sql_agent_response.get("data", []))
    print(f"{'='*80}\n")
    # Store response in state
    state["sql_agent_response"] = sql_agent_response
   
    # Log data received for debugging
    print(f"\n{'='*80}")
    print(f"📊 SQL AGENT RESPONSE:")
    print(f"{'='*80}")
    print(f"SQL Agent RESPONSE: {sql_agent_response.get('response', 'unknown')}")
    print(f"  Status: {sql_agent_response.get('status', 'unknown')}")
    print(f"  SQL Query: {sql_agent_response.get('sql_query', 'None')[:100]}...")
    print(f"  Columns: {sql_agent_response.get('columns', [])}")
    if sql_agent_response.get('data'):
        print(f"  Sample Data (first row): {sql_agent_response['data'][0] if sql_agent_response['data'] else 'None'}")
    print(f"{'='*80}\n")
   
    # Always route to response_formatter
    # The response_formatter will handle both success and error cases
    state["next_step"] = "response_formatter"
   
    # Log reasoning for debugging
    state["reasoning_log"].append({
        "agent": "sql_agent_router",
        "step": "SQL Agent Query Processing",
        "reasoning": f"Status: {sql_agent_response.get('status', 'unknown')}",
        "sql_query": sql_agent_response.get('sql_query', ''),
        "columns": sql_agent_response.get('columns', [])
    })
   
    return state
 

# =========================================================================
# HELPER FORMATTING FUNCTIONS 
# =========================================================================

def generate_conversational_response(
    sql_agent_response_msg: str,
    conversation_history: List[Dict[str, str]],
    user_query: str,
    data: List[tuple],
    columns: List[str]
) -> str:
    """
    Generate a conversational response using the SQL agent's response,
    conversation history, and data to make it more contextual and natural.
    Extracts key insights from limited data to avoid token overflow.
    """
    
    # Build conversation context
    history_context = ""
    if conversation_history:
        recent_history = conversation_history[-4:]  # Last 2 exchanges
        history_context = "\n".join([
            f"{msg['role'].upper()}: {msg['content']}" 
            for msg in recent_history
        ])
    
    # Limit data to 20 rows for token efficiency
    limited_data = data[:20] if data else []
    
    # Convert to dictionaries for easier analysis
    data_dicts = []
    if limited_data:
        data_dicts = [dict(zip(columns, row)) for row in limited_data]
    
    # Build data summary with actual analysis
    data_summary_lines = [
        f"Total rows in result: {len(data)}",
        f"Showing first 20 rows for analysis",
        f"Columns: {', '.join(columns)}"
    ]
    
    # Provide top/sample data for LLM to analyze
    if data_dicts:
        data_summary_lines.append(f"\nSample Data (first 20 rows for analysis):")
        for i, row_dict in enumerate(data_dicts[:20], 1):
            data_summary_lines.append(f"{i}. {row_dict}")
    
    data_summary = "\n".join(data_summary_lines)
    
    prompt = f"""You are a helpful data analyst explaining database query results to a business user.

Conversation History:
{history_context if history_context else "No previous conversation"}

User's Question: {user_query}

SQL Agent's Response:
{sql_agent_response_msg}

Data Overview:
{data_summary}

IMPORTANT GUIDELINES:

1. **Start with the total COUNT**: Look for the ```count``` block and begin with it. State the total rows analyzed and what they represent.

2. **EXTRACT AND HIGHLIGHT TOP INSIGHTS**: This is CRITICAL. Analyze the provided data and identify:
   - **Top values/customers/items**: If data is sorted, identify the top 1-3 entries with their specific values
   - **Comparisons**: Compare top vs. second tier entries (e.g., "X is 50% higher than Y")
   - **Trends or patterns**: What do the top results tell you? (e.g., "few customers account for majority of sales", "significant variation in values")
   - **Business implications**: What does this mean? (e.g., "opportunity for targeted marketing", "need to diversify customer base")
   - **Diversity/Range**: Mention the spread (e.g., "values range from $X to $Y across customers")

3. **DO NOT** be generic. Use specific numbers and names from the data.
   Example of GOOD insight: "The top customer is PARAMOUNT LIMITED with an average order value of 11,245,500.00, followed by DYNA GLYCOLS with 7,614,820.00."
   Example of BAD insight: "Some customers have higher values than others."

4. **Extract REFERENCE MAPPINGS from filters**: 
   - Only include if you have mappings in the SQL agent response
   - Look in the ```filters``` block for patterns like "Status is 'Open' (1)"
   - CRITICAL FORMAT:
   
**Reference Mappings:**

• Open (ID: 1)
• Rejected (ID: 4)

5. **Mention FILTERS applied**: Extract WHERE conditions, GROUP BY, ORDER BY from ```filters``` block 

6. **Sound like a business analyst**: Natural, conversational, but professional and insightful

7. **End with actionable offer**: "Would you like me to explore [specific aspect] further or help you visualize this data?"

RESPONSE STRUCTURE:
[Count statement] [Top insights with specific numbers] [Business implications] [Trends/diversity observation]

If applicable:
**Reference Mappings:**
• Item (ID: X)

[Actionable closing offer]

Conversational Response:"""

    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        return response.content.strip()
    except Exception as e:
        print(f"[ERROR] Failed to generate conversational response: {e}")
        # Fallback to SQL agent's response
        return sql_agent_response_msg

def generate_intelligent_summary(user_query: str, data: List[tuple], columns: List[str], display_format: str) -> str:
    """Generate an intelligent summary of the data with insights"""
    
    if len(data) == 0:
        return "No records found matching your criteria."
    
    query_lower = user_query.lower()
    
    # For tables with detailed records
    if display_format in ["text_table", "table"] and len(data) > 0:
        # Provide contextual intro without "I found X records"
        insights = []
        
        if data and columns:
            # Check if there's an industry column
            if any('industry' in col.lower() for col in columns):
                industry_idx = next(i for i, col in enumerate(columns) if 'industry' in col.lower())
                industries = list(set([row[industry_idx] for row in data[:10] if len(row) > industry_idx and row[industry_idx]]))
                if 1 <= len(industries) <= 3:
                    # Format industries nicely
                    formatted = [str(i).title() for i in industries[:3]]
                    if len(formatted) == 1:
                        insights.append(f"These are from the {formatted[0]} industry.")
                    elif len(formatted) == 2:
                        insights.append(f"These are from {formatted[0]} and {formatted[1]} industries.")
                    else:
                        insights.append(f"These are from {', '.join(formatted[:-1])}, and {formatted[-1]} industries.")
            
            # Check if there's a status column
            if any('status' in col.lower() for col in columns):
                status_idx = next(i for i, col in enumerate(columns) if 'status' in col.lower())
                statuses = list(set([row[status_idx] for row in data[:10] if len(row) > status_idx and row[status_idx]]))
                if 1 <= len(statuses) <= 3:
                    formatted = [str(s).title() for s in statuses[:3]]
                    if len(formatted) == 1:
                        insights.append(f"Status: {formatted[0]}.")
                    elif len(formatted) == 2:
                        insights.append(f"Status includes {formatted[0]} and {formatted[1]}.")
                    else:
                        insights.append(f"Status includes {', '.join(formatted[:-1])}, and {formatted[-1]}.")
            
            # Check for customer/company names
            if any('customer' in col.lower() or 'company' in col.lower() for col in columns):
                name_idx = next((i for i, col in enumerate(columns) if 'customer' in col.lower() or 'company' in col.lower()), None)
                if name_idx is not None:
                    names = [row[name_idx] for row in data[:3] if len(row) > name_idx and row[name_idx]]
                    if names and len(names) <= 3:
                        insights.append(f"Including {', '.join(str(n) for n in names[:3])}{'...' if len(data) > 3 else ''}.")
        
        if insights:
            return f"{insights[0]} Here are the details:"
        else:
            return "Here are the details:"
    
    # For charts with aggregated data
    elif display_format in ["text_graph", "graph"] and len(data) > 0:
        # Analyze the data for insights
        if len(columns) >= 2 and data:
            # Assuming first col is category, second is value
            try:
                # Find numeric column
                numeric_idx = None
                for idx, col in enumerate(columns):
                    if any(kw in col.lower() for kw in ['count', 'total', 'sum', 'avg', 'average', 'value', 'amount']):
                        numeric_idx = idx
                        break
                
                if numeric_idx is not None and data:
                    # Get top value
                    sorted_data = sorted(data, key=lambda x: float(x[numeric_idx]) if len(x) > numeric_idx else 0, reverse=True)
                    top_row = sorted_data[0] if sorted_data else None
                    
                    if top_row and len(top_row) > 1:
                        category_val = top_row[0] if numeric_idx > 0 else top_row[1]
                        numeric_val = top_row[numeric_idx]
                        
                        metric_name = columns[numeric_idx].replace('_', ' ').replace('lead ', '').replace('order ', '').title()
                        
                        return f"The highest {metric_name.lower()} is '{category_val}' with {numeric_val}. Here's the breakdown:"
            except:
                pass
        
        return "Here's the visualization:"
    
    # Fallback
    return ""


def generate_contextual_title(user_query: str, columns: List[str]) -> str:
    """Generate a contextual title based on the query and data"""
    query_lower = user_query.lower()
    
    # Extract key entities from query
    if "lead" in query_lower:
        entity = "Leads"
    elif "quotation" in query_lower or "quote" in query_lower:
        entity = "Quotations"
    elif "order" in query_lower:
        entity = "Orders"
    elif "dispatch" in query_lower:
        entity = "Dispatches"
    elif "schedule" in query_lower:
        entity = "Schedules"
    elif "customer" in query_lower:
        entity = "Customers"
    else:
        entity = "Results"
    
    # Make title contextual
    if "where" in query_lower or "with" in query_lower:
        return f"{entity}"
    elif "by" in query_lower:
        return f"{entity} Analysis"
    elif "top" in query_lower:
        return f"Top {entity}"
    else:
        return f"{entity}"


def generate_table_format(data: List[tuple], columns: List[str], title: str = "Query Results") -> Dict:
    """
    Format data as a table structure compatible with frontend
    """
    return {
        "title": title,
        "headers": columns,
        # Emit rows as objects keyed by headers so the frontend can read values by column name
        "rows": [
            {col: row[idx] for idx, col in enumerate(columns) if idx < len(row)}
            for row in data
        ]
    }


def generate_chart_format(
    chart_type: str,
    title: str,
    data: List[tuple],
    columns: List[str],
    x_column: str,
    y_column: str
) -> Optional[Dict]:
    """
    Format data as a chart structure compatible with frontend.
    Transforms tabular data into chart format.
    """
    if not data or not columns:
        return None
    try:
        x_idx = columns.index(x_column)
        y_idx = columns.index(y_column)
        chart_data = [
            {x_column: row[x_idx], y_column: row[y_idx]}
            for row in data
        ]
        return {
            "chartType": chart_type,
            "title": title,
            "data": chart_data,
            "xKey": x_column,
            "yKey": y_column
        }
    except (ValueError, IndexError):
        return None


def infer_display_preferences(user_query: str) -> Dict[str, Any]:
    """Infer whether the user asked for a chart, a table, or both."""
    text = user_query.lower()

    chart_keywords = ["chart", "graph", "plot", "visualize", "trend", "over time", "timeline", "visualisation", "visualization"]
    table_keywords = ["table", "tabular", "grid", "list", "rows", "spreadsheet"]

    wants_chart = any(k in text for k in chart_keywords)
    wants_table = any(k in text for k in table_keywords)

    chart_only = any(phrase in text for phrase in ["only chart", "chart only", "just chart", "only graph", "graph only", "just graph"])
    table_only = any(phrase in text for phrase in ["only table", "table only", "just table", "just the table"])

    # Default: show table when we have rows, unless user explicitly asked for chart only
    if not wants_chart and not wants_table:
        wants_table = True

    if chart_only:
        wants_chart = True
        wants_table = False
    if table_only:
        wants_table = True
        wants_chart = False

    wants_text = not chart_only and not table_only  # keep a short summary unless explicitly suppressed

    return {
        "wants_chart": wants_chart,
        "wants_table": wants_table,
        "wants_text": wants_text,
        "chart_only": chart_only,
        "table_only": table_only,
    }


def choose_chart_type(user_query: str, columns: List[str], sample_row: Optional[tuple]) -> str:
    """Pick a chart type based on intent and available columns."""
    text = user_query.lower()

    explicit_map = {
        "line": ["line", "trend", "timeline", "over time"],
        "bar": ["bar", "compare", "comparison", "vs"],
        "pie": ["pie", "percentage", "share", "proportion"],
        "scatter": ["scatter", "distribution", "correlation"],
    }

    for chart_type, keywords in explicit_map.items():
        if any(k in text for k in keywords):
            return chart_type

    # Heuristics from data shape
    numeric_cols = []
    datetime_cols = []
    if sample_row:
        for idx, col in enumerate(columns):
            val = sample_row[idx]
            if isinstance(val, (int, float)):
                numeric_cols.append(col)
            if isinstance(val, (str,)) and re.search(r"\d{4}-\d{2}-\d{2}", str(val)):
                datetime_cols.append(col)

    if datetime_cols:
        return "line"
    if len(numeric_cols) >= 2:
        return "scatter"
    if len(numeric_cols) == 1:
        return "bar"

    return "bar"


def decide_display_format(
    user_query: str, 
    columns: List[str], 
    sample_rows: List[tuple],
    conversation_history: List[Dict[str, str]] = None,
    sql_response_msg: str = None
) -> Dict[str, Any]:
    """Determine display mode and chart type using LLM-based approach while RESPECTING explicit user preferences."""
    
    query_lower = user_query.lower()
    conversation_history = conversation_history or []
    
    # ============================================================================
    # STEP 1: Detect explicit user chart type preferences
    # ============================================================================
    explicit_chart_type = None
    if any(word in query_lower for word in ["bar chart", "bar graph", "bar plot"]):
        explicit_chart_type = "bar"
    elif any(word in query_lower for word in ["line chart", "line graph", "line plot"]):
        explicit_chart_type = "line"
    elif any(word in query_lower for word in ["pie chart", "pie graph"]):
        explicit_chart_type = "pie"
    elif any(word in query_lower for word in ["scatter plot", "scatter chart", "scatter graph"]):
        explicit_chart_type = "scatter"
    
    wants_only_chart = any(phrase in query_lower for phrase in ["only chart", "chart only", "just chart", "only graph", "graph only", "just graph"])
    wants_only_table = any(phrase in query_lower for phrase in ["only table", "table only", "just table"])
    
    # ============================================================================
    # STEP 2: Let LLM decide display format based on query, history, and SQL response
    # ============================================================================
    print(f"[DECISION] Using LLM to decide display format based on enhanced query, history, and SQL response")
    
    return _llm_decide_display_format(
        user_query, columns, sample_rows[:3] if sample_rows else [], 
        explicit_chart_type, wants_only_chart, wants_only_table,
        conversation_history, sql_response_msg
    )


def _llm_decide_display_format(
    user_query: str, 
    columns: List[str], 
    sample_preview: List[tuple],
    explicit_chart_type: Optional[str],
    wants_only_chart: bool,
    wants_only_table: bool,
    conversation_history: List[Dict[str, str]] = None,
    sql_response_msg: str = None
) -> Dict[str, Any]:
    """Fallback LLM-based decision for ambiguous cases using conversation context."""
    
    query_lower = user_query.lower()
    conversation_history = conversation_history or []
    
    # Build conversation context
    history_context = ""
    if conversation_history:
        recent_history = conversation_history[-4:]  # Last 2 exchanges
        history_context = "\n".join([
            f"{msg['role'].upper()}: {msg['content'][:100]}..." if len(msg['content']) > 100 else f"{msg['role'].upper()}: {msg['content']}"
            for msg in recent_history
        ])
    
    # Build SQL response context
    sql_context = ""
    if sql_response_msg:
        sql_context = f"\n\nSQL Agent's Response Preview:\n{sql_response_msg[:200]}..."
    
    # Build prompt that respects user preferences
    user_preference_context = ""
    if explicit_chart_type:
        user_preference_context = f"\n**IMPORTANT: User explicitly requested a {explicit_chart_type.upper()} chart. You MUST use chart_type: '{explicit_chart_type}'.**"
    if wants_only_chart:
        user_preference_context += "\n**IMPORTANT: User wants ONLY a chart/graph (no table). Use display: 'graph' or 'text_graph'.**"
    if wants_only_table:
        user_preference_context += "\n**IMPORTANT: User wants ONLY a table. Use display: 'table' or 'text_table'.**"
    
    prompt = f"""
You pick the best display for a SQL query result while RESPECTING user preferences.

CONVERSATION CONTEXT:
{history_context if history_context else "No previous conversation"}

CURRENT QUERY DETAILS:
User query: {user_query}
Columns: {columns}
Sample rows: {sample_preview}{sql_context}
{user_preference_context}

OPTIONS:
- text (text summary only) - for single values, simple counts
- table (table only) - rarely used
- graph (chart/graph only) - rarely used
- text_table (text summary + table) - for listing records with details
- text_graph (text summary + graph) - for grouped aggregations, trends, comparisons

Chart types allowed: bar, line, pie, scatter.

GENERAL DECISION RULES (not specific to any domain):
1. **TEXT ONLY**: Single value results (count, sum, average without grouping)
   - Result has 1 row, 1 column
   - Query asks "how many", "what is the total" without "by"

2. **TEXT + TABLE**: Detail/listing queries
   - Query starts with "list", "show", "get", "find", "which"
   - Multiple rows with identifiers or detailed attributes
   - User wants to see individual records

3. **TEXT + CHART**: Aggregated/grouped data
   - Query contains "by [category]" or "per [timeframe]"
   - Query asks for "trend", "over time", "comparison"
   - Query asks for "top N", "highest", "lowest"
   - Multiple rows where one column is categorical and another is numeric

CHART TYPE SELECTION:
- **line**: Temporal data (time series, trends over time, dates)
- **bar**: Category comparisons, top N, discrete groups
- **pie**: Proportions, percentages, share (rarely appropriate)
- **scatter**: Correlation between two numeric variables

Respond with JSON only:
{{
  "display": "text|table|graph|text_table|text_graph",
  "chart_type": "bar|line|pie|scatter|none",
  "reason": "short reason based on query pattern and data structure"
}}
"""

    try:
        llm_resp = llm.invoke([SystemMessage(content=prompt)])
        resp_text = llm_resp.content.strip()
        json_match = re.search(r"\{.*\}", resp_text, re.DOTALL)
        parsed = json.loads(json_match.group(0) if json_match else resp_text)
        
        display = parsed.get("display", "text_table")
        chart_type = parsed.get("chart_type", "bar")
        
        # FORCE user's explicit preferences if LLM didn't respect them
        if explicit_chart_type and chart_type != explicit_chart_type:
            print(f"[OVERRIDE] LLM chose {chart_type}, but user requested {explicit_chart_type}")
            chart_type = explicit_chart_type
        
        if wants_only_chart and display not in ["graph", "text_graph"]:
            print(f"[OVERRIDE] LLM chose {display}, but user wants only chart")
            display = "graph"
        
        if wants_only_table and display not in ["table", "text_table"]:
            print(f"[OVERRIDE] LLM chose {display}, but user wants only table")
            display = "table"
        
        print(f"[LLM DECISION] Display: {display}, Chart: {chart_type}, Reason: {parsed.get('reason', 'N/A')}")
        
        return {
            "display": display,
            "chart_type": None if chart_type == "none" else chart_type,
        }
    except Exception as e:
        print(f"Display format decision fallback due to error: {e}")
        # Fallback respects user preferences too
        if explicit_chart_type:
            return {"display": "graph", "chart_type": explicit_chart_type}
        return {"display": "text_table", "chart_type": None}


def response_formatter(state: ConversationState) -> ConversationState:
    """
    Formats the response based on SQL Agent output
    Determines response format: text, table, graph, or combination
    """
    sql_response = state.get("sql_agent_response", {})
    user_query = state["user_query"]
    enhanced_query = state["enhanced_query"]
    
    status = sql_response.get("status", "error")
    # Capture SQL query for downstream usage
    # Extract from response markdown if not directly available
    sql_query = sql_response.get("sql_query", "")
    if not sql_query and sql_response.get("response"):
        # Try to extract SQL from ```sql...``` block in response
        response_text = sql_response.get("response", "")
        print(f"[RESPONSE_FORMATTER] Attempting SQL extraction from response: {response_text[:200]}...")
        sql_match = re.search(r'```sql\s*(.*?)\s*```', response_text, re.DOTALL)
        if sql_match:
            sql_query = sql_match.group(1).strip()
            print(f"[RESPONSE_FORMATTER] ✅ SQL extracted: {sql_query[:100]}...")
        else:
            print(f"[RESPONSE_FORMATTER] ❌ No SQL block found in response")
    print(f"[RESPONSE_FORMATTER] Final sql_query: {sql_query[:100] if sql_query else 'EMPTY'}...")
    state["sql_query"] = sql_query

    # Reset rendered payloads for this turn
    state["table_data"] = None
    state["chart_data"] = None
    state["chart_type"] = None
    
    # Handle different statuses
    if status == "success":
        data = sql_response.get("data", [])
        columns = sql_response.get("columns", [])
        response_msg = sql_response.get("response", "")
        
        # Let the LLM decide the display type (overrides user phrasing)
        # Use enhanced_query for better pattern matching, especially for follow-up queries
        query_for_decision = state.get("enhanced_query") or user_query
        display_choice = decide_display_format(
            query_for_decision, 
            columns, 
            data[:3] if data else [],
            conversation_history=state.get("conversation_history", []),
            sql_response_msg=response_msg
        )
        choice = display_choice.get("display", "text_table")
        chart_type_hint = display_choice.get("chart_type")

        # Business rule: ALWAYS text + table. Chart only if user explicitly requests it.
        # Check for explicit chart keywords in the original user query
        user_query_lower = user_query.lower()
        explicit_chart_keywords = [
            "chart", "graph", "plot", "visualize", "visualization",
            "bar chart", "line chart", "pie chart", "scatter plot",
            "bar graph", "line graph", "pie graph"
        ]
        wants_chart = any(kw in user_query_lower for kw in explicit_chart_keywords)
        wants_table = True
        wants_text = True
        text_only = False

        table_payload: Optional[Dict] = None
        chart_payload: Optional[Dict] = None
        chart_type: Optional[str] = None

        # Generate contextual title for table
        contextual_title = generate_contextual_title(user_query, columns)

        if data and columns and wants_table:
            table_payload = generate_table_format(
                data,
                columns,
                title=contextual_title
            )

        if wants_chart and data and columns:
            chart_type = chart_type_hint or choose_chart_type(user_query, columns, data[0] if data else None)

            # Choose axes: prefer a categorical/date column on x and numeric on y
            numeric_cols: List[str] = []
            categorical_cols: List[str] = []
            first_row = data[0] if data else []

            # Treat id/status/type-like columns as categorical even if numeric
            categorical_name_hints = [
                "name", "status", "category", "type", "id", "code",
                "segment", "region", "state", "city", "month", "date", "day", "year"
            ]

            for idx, col in enumerate(columns):
                if not first_row:
                    continue
                val = first_row[idx]
                if isinstance(val, (int, float)):
                    numeric_cols.append(col)
                    if any(hint in col.lower() for hint in categorical_name_hints):
                        categorical_cols.append(col)
                else:
                    categorical_cols.append(col)

            x_col = None
            y_col = None

            if categorical_cols:
                x_col = categorical_cols[0]
            elif columns:
                x_col = columns[0]

            # Prefer numeric metric different from x_col
            metric_candidates = [col for col in numeric_cols if col != x_col]
            if metric_candidates:
                y_col = metric_candidates[0]
            elif len(columns) > 1:
                # fallback to second column if available
                y_col = columns[1] if columns[1] != x_col else (columns[0] if len(columns) else None)
            elif numeric_cols:
                y_col = numeric_cols[0]
            elif columns:
                y_col = columns[0]

            if x_col and y_col:
                # Generate better chart title
                chart_title = contextual_title.replace(" records)", "").replace(" found)", "")
                chart_payload = generate_chart_format(
                    chart_type=chart_type or "bar",
                    title=chart_title,
                    data=data,
                    columns=columns,
                    x_column=x_col,
                    y_column=y_col
                )

        # Generate conversational response using SQL agent's response and conversation history
        conversational_response = generate_conversational_response(
            sql_agent_response_msg=response_msg,
            conversation_history=state.get("conversation_history", []),
            user_query=user_query,
            data=data,
            columns=columns
        )

        # Decide final response format with conversational responses
        if chart_payload and wants_chart and table_payload:
            state["chart_data"] = chart_payload
            state["chart_type"] = chart_type or chart_payload.get("chartType")
            state["table_data"] = table_payload
            state["response_format"] = "text_graph"  # text + table + chart (only when explicitly requested)
            state["final_response"] = conversational_response
        else:
            # Default: always return text + table (no chart unless explicitly requested)
            if table_payload:
                state["table_data"] = table_payload
            state["response_format"] = "text_table"  # text + table
            state["final_response"] = conversational_response

    
    else:
        # Error handling
        error_msg = sql_response.get("message", "I encountered an issue retrieving the data.")
        state["final_response"] = f"{error_msg} Could you try rephrasing your question?"
        state["response_format"] = "text"
        state["sql_query"] = sql_response.get("sql_query", "")
    
    state["next_step"] = "END"
    
    # Debug: log formatted payload sent to frontend
    table_dbg = state.get("table_data") or {}
    chart_dbg = state.get("chart_data") or {}
    rows_dbg = table_dbg.get("rows") or []
    print("[DEBUG] response_formatter => format=", state.get("response_format"),
          " table_headers=", table_dbg.get("headers"),
          " table_rows=", len(rows_dbg),
          " first_row=", rows_dbg[0] if rows_dbg else None,
          " chart_keys=", list(chart_dbg.keys()) if chart_dbg else None)

    state["reasoning_log"].append({
        "agent": "response_formatter",
        "step": "Response Formatting",
        "reasoning": f"Format: {state['response_format']}, Status: {status}"
    })
    
    return state


# ============================================================================
# ROUTING LOGIC
# ============================================================================

def route_next_step(state: ConversationState) -> Literal["query_enhancer", "conversation_handler", "sql_agent_router", "response_formatter", END]:
    """Route to next agent based on state"""
    next_step = state.get("next_step", "END")
    
    if next_step == "query_enhancer":
        return "query_enhancer"
    elif next_step == "conversation_handler":
        return "conversation_handler"
    elif next_step == "sql_agent_router":
        return "sql_agent_router"
    elif next_step == "response_formatter":
        return "response_formatter"
    else:
        return END


# ============================================================================
# GRAPH CONSTRUCTION
# ============================================================================

def build_conversation_agent():
    """Build the conversation agent graph"""
    workflow = StateGraph(ConversationState)
    
    # Add nodes
    workflow.add_node("intent_and_scope_classifier", intent_and_scope_classifier)
    workflow.add_node("conversation_handler", conversation_handler)
    workflow.add_node("query_enhancer", query_enhancer)
    workflow.add_node("sql_agent_router", sql_agent_router)
    workflow.add_node("response_formatter", response_formatter)
    
    # Set entry point
    workflow.set_entry_point("intent_and_scope_classifier")
    
    # Add conditional edges
    workflow.add_conditional_edges(
        "intent_and_scope_classifier",
        route_next_step,
        {
            "conversation_handler": "conversation_handler",
            "query_enhancer": "query_enhancer",
            END: END
        }
    )
    
    workflow.add_edge("conversation_handler", END)
    
    workflow.add_conditional_edges(
        "query_enhancer",
        route_next_step,
        {
            "sql_agent_router": "sql_agent_router",
            END: END
        }
    )
    
    workflow.add_conditional_edges(
        "sql_agent_router",
        route_next_step,
        {
            "response_formatter": "response_formatter",
            END: END
        }
    )
    
    workflow.add_edge("response_formatter", END)
    
    # Compile with memory
    memory = MemorySaver()
    return workflow.compile(checkpointer=memory)


# ============================================================================
# MAIN EXECUTION FUNCTION
# ============================================================================

def run_conversation_agent(user_query: str, conversation_history: List[Dict[str, str]] = None):
    """
    Main function to run the conversation agent
    """
    agent = build_conversation_agent()
    
    initial_state = {
        "messages": [],
        "user_query": user_query,
        "enhanced_query": "",
        "intent": "",
        "is_in_scope": True,
        "scope_validation_result": "",
        "conversation_history": conversation_history or [],
        "sql_agent_response": None,
        "response_format": "text",
        "final_response": "",
        "table_data": None,
        "chart_data": None,
        "chart_type": None,
        "sql_query": "",
        "next_step": "",
        "reasoning_log": []
    }
    
    config = {"configurable": {"thread_id": "sales_conversation_1"}}
    result = agent.invoke(initial_state, config)
    
    print(f"[RUN_CONVERSATION_AGENT] State sql_query after invoke: '{result.get('sql_query', 'MISSING')[:80] if result.get('sql_query') else 'EMPTY'}'")
    
    # Update conversation history
    updated_history = result["conversation_history"]
    updated_history.append({"role": "user", "content": user_query})
    updated_history.append({"role": "assistant", "content": result["final_response"]})
    
    return {
        "response": result["final_response"],
        "enhanced_query": result.get("enhanced_query", ""),
        "intent": result["intent"],
        "is_in_scope": result["is_in_scope"],
        "response_format": result.get("response_format", "text"),
        "table_data": result.get("table_data"),
        "chart_data": result.get("chart_data"),
        "chart_type": result.get("chart_type"),
        "sql_query": result.get("sql_query", ""),
        "conversation_history": updated_history,
        "reasoning_log": result["reasoning_log"]
    }


# ============================================================================
# TERMINAL TESTING
# ============================================================================

def interactive_terminal_test():
    """Interactive terminal testing with full conversation history display"""
    print("="*80)
    print("🤖 SALES CRM CONVERSATION AGENT - INTERACTIVE TEST")
    print("="*80)
    print("\n👋 Welcome! I'm your Sales CRM assistant.")
    print("\nCommands:")
    print("  - Type your question naturally")
    print("  - 'history' to view conversation history")
    print("  - 'reset' to clear conversation")
    print("  - 'debug' to toggle detailed logging")
    print("  - 'quit' to exit")
    print("="*80 + "\n")
    
    conversation_history = []
    debug_mode = False
    
    while True:
        try:
            user_input = input("\n💬 You: ").strip()
            
            if not user_input:
                continue
            
            # Handle commands
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("\n👋 Goodbye!")
                break
            
            if user_input.lower() == 'reset':
                conversation_history = []
                print("\n✅ Conversation reset!\n")
                continue
            
            if user_input.lower() == 'debug':
                debug_mode = not debug_mode
                print(f"\n🔧 Debug mode: {'ON' if debug_mode else 'OFF'}\n")
                continue
            
            if user_input.lower() == 'history':
                print("\n" + "="*80)
                print("📜 CONVERSATION HISTORY")
                print("="*80)
                if not conversation_history:
                    print("No conversation history yet.")
                else:
                    for i, msg in enumerate(conversation_history, 1):
                        role = "👤 USER" if msg['role'] == 'user' else "🤖 ASSISTANT"
                        print(f"\n[{i}] {role}:")
                        print(f"{msg['content']}")
                print("="*80 + "\n")
                continue
            
            # Process query
            print("\n⏳ Processing...\n")
            
            result = run_conversation_agent(user_input, conversation_history)
            conversation_history = result["conversation_history"]
            
            # Display response
            print("="*80)
            print("🤖 ASSISTANT:")
            print("="*80)
            print(result['response'])
            print("="*80)

            # If we produced table_data, show a quick preview inline for debugging
            table_payload = result.get("table_data")
            if table_payload:
                headers = table_payload.get("headers", [])
                rows = table_payload.get("rows", [])
                print("\n📝 TABLE PREVIEW:")
                print(" | ".join(str(h) for h in headers))
                print("-" * 80)
                for row in rows[:10]:
                    # row is a dictionary, so extract values in the order of headers
                    values = [str(row.get(h, "")) for h in headers]
                    print(" | ".join(values))
                if len(rows) > 10:
                    print(f"... ({len(rows) - 10} more rows)")
            
            # Show enhanced query if available
            if result.get('enhanced_query'):
                print(f"\n💡 Enhanced Query: {result['enhanced_query']}")
            
            # Show metadata
            print(f"\n📊 Intent: {result['intent']} | In Scope: {result['is_in_scope']} | Format: {result['response_format']}")
            
            # Debug mode details
            if debug_mode:
                print("\n" + "-"*80)
                print("🧠 REASONING LOG:")
                print("-"*80)
                for i, log in enumerate(result['reasoning_log'], 1):
                    print(f"\n[{i}] {log['agent']}")
                    print(f"    {log['step']}: {log['reasoning']}")
                print("-"*80)
                
                # Show conversation history
                print("\n" + "-"*80)
                print("📜 CONVERSATION HISTORY (Last 4 messages):")
                print("-"*80)
                for msg in conversation_history[-4:]:
                    role = "USER" if msg['role'] == 'user' else "ASST"
                    print(f"[{role}] {msg['content'][:100]}...")
                print("-"*80)
            
            print()
            
        except KeyboardInterrupt:
            print("\n\n👋 Interrupted. Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {str(e)}")


# ============================================================================
# PYDANTIC MODELS FOR API
# ============================================================================

class QueryRequest(BaseModel):
    user_query: str
    conversation_history: Optional[List[Dict[str, str]]] = None


class QueryResponse(BaseModel):
    response: str
    enhanced_query: str
    intent: str
    is_in_scope: bool
    response_format: str
    table_data: Optional[Dict] = None
    chart_data: Optional[Dict] = None
    chart_type: Optional[str] = None
    conversation_history: List[Dict[str, str]]
    reasoning_log: List[Dict[str, Any]]



def create_copilotkit_adapter(agent_graph):

    """

    Create a CopilotKit-compatible adapter that converts MessagesState to ConversationState

    FIXED: Filters out ToolMessages to prevent infinite loops

    """

    async def copilotkit_adapter(state: MessagesState) -> MessagesState:

        """Adapter that converts MessagesState to ConversationState and back"""

        messages = state["messages"]

        # ============================================================

        # FIX: Filter out ALL ToolMessages to prevent loop

        # ============================================================

        filtered_messages = [

            msg for msg in messages 

            if not isinstance(msg, ToolMessage)

        ]

        print(f"\n[ADAPTER] Total messages: {len(messages)}, After filtering: {len(filtered_messages)}")

        # If no messages after filtering, return empty

        if not filtered_messages:

            print("[ADAPTER] No messages to process after filtering")

            return {"messages": []}

        # Only process if last message is from user

        last_msg = filtered_messages[-1]

        if not isinstance(last_msg, HumanMessage):

            print(f"[ADAPTER] Last message is {type(last_msg).__name__}, not HumanMessage. Skipping.")

            return {"messages": []}

        # Extract user query

        user_query = last_msg.content

        print(f"[ADAPTER] Processing user query: {user_query[:100]}...")

        # Build conversation history from filtered messages

        conversation_history = []

        for msg in filtered_messages[:-1]:

            if isinstance(msg, HumanMessage):

                conversation_history.append({"role": "user", "content": msg.content})

            elif isinstance(msg, AIMessage):

                if msg.content and not msg.tool_calls:

                    conversation_history.append({"role": "assistant", "content": msg.content})

        # Invoke the actual agent

        result = run_conversation_agent(user_query, conversation_history)

        print(f"[ADAPTER] 🔍 SQL Query in result: '{result.get('sql_query', 'MISSING')[:100] if result.get('sql_query') else 'EMPTY'}'")

        # Prepare tool calls

        tool_calls = []

        if result.get("chart_data"):

            chart_data = result["chart_data"]
            chart_args = dict(chart_data)
            chart_args["sqlQuery"] = result.get("sql_query", "")

            tool_calls.append({

                "name": "generate_chart",

                "args": chart_args,

                "id": str(uuid.uuid4()),

                "type": "tool_call"

            })

        if result.get("table_data"):

            table_data = result["table_data"]
            table_args = dict(table_data)
            table_args["sqlQuery"] = result.get("sql_query", "")

            tool_calls.append({

                "name": "generate_table",

                "args": table_args,

                "id": str(uuid.uuid4()),

                "type": "tool_call"

            })

        print(f"[ADAPTER] Sending {len(tool_calls)} tool calls to frontend")
        # Verbose debug of payload being sent to frontend
        try:
            print("[ADAPTER] Frontend payload debug:")
            print("  intent:", result.get("intent"))
            print("  in_scope:", result.get("is_in_scope"))
            print("  response_format:", result.get("response_format"))
            print("  chart_type:", result.get("chart_type"))
            print("  sql_query:", result.get("sql_query"))
            tbl = result.get("table_data") or {}
            ch = result.get("chart_data") or {}
            print("  table_headers:", tbl.get("headers"))
            rows = (tbl.get("rows") or []) if isinstance(tbl, dict) else []
            print("  table_rows:", len(rows))
            if rows:
                print("  table_first_row:", rows[0])
            print("  chart_summary:", {
                "type": ch.get("chartType") if isinstance(ch, dict) else None,
                "xKey": ch.get("xKey") if isinstance(ch, dict) else None,
                "yKey": ch.get("yKey") if isinstance(ch, dict) else None,
                "points": len(ch.get("data", [])) if isinstance(ch, dict) else 0,
            })
            if tool_calls:
                import json as _json
                print("[ADAPTER] Tool calls JSON:")
                print(_json.dumps(tool_calls, ensure_ascii=False, indent=2))
            core_snapshot = {
                "response": result.get("response"),
                "enhanced_query": result.get("enhanced_query"),
                "sql_query": result.get("sql_query"),
                "response_format": result.get("response_format"),
                "table_data": result.get("table_data"),
                "chart_data": result.get("chart_data"),
                "chart_type": result.get("chart_type"),
                "reasoning_log": result.get("reasoning_log"),
            }
            print("[ADAPTER] Result snapshot:")
            print(_json.dumps(core_snapshot, ensure_ascii=False, indent=2))
        except Exception as e:
            print(f"[ADAPTER] Debug print error: {e}")
 
        message_kwargs = {"content": result["response"]}

        if tool_calls:

            message_kwargs["tool_calls"] = tool_calls

        # Also print the final message payload
        try:
            import json as _json
            print("[ADAPTER] Final AIMessage payload:")
            print(_json.dumps(message_kwargs, ensure_ascii=False, indent=2))
        except Exception:
            pass

        response_message = AIMessage(**message_kwargs)

        return {"messages": [response_message]}

    # Build CopilotKit-compatible graph

    copilotkit_workflow = StateGraph(MessagesState)

    copilotkit_workflow.add_node("agent", copilotkit_adapter)

    copilotkit_workflow.set_entry_point("agent")

    copilotkit_workflow.add_edge("agent", END)

    copilotkit_graph = copilotkit_workflow.compile(checkpointer=MemorySaver())

    return copilotkit_graph
 


def create_app():
    """
    Create and configure the FastAPI app with CopilotKit integration
    """
    app = FastAPI(
        title="Sales CRM Conversation Agent API",
        version="1.0.0",
        description="AI assistant for Sales CRM conversations"
    )
    
    # Build the conversation agent graph
    agent_graph = build_conversation_agent()
    
    # Create CopilotKit adapter graph
    copilotkit_graph = create_copilotkit_adapter(agent_graph)
    
    # Wrap with CopilotKit
    copilotkit_agent = LangGraphAGUIAgent(
        name="sales_crm_agent",
        description="AI assistant for Sales CRM data queries and management",
        graph=copilotkit_graph,
    )
    
    # Add the CopilotKit endpoint
    add_langgraph_fastapi_endpoint(
        app=app,
        agent=copilotkit_agent,
        path="/copilotkit",
    )
    
    # Add health check endpoint
    @app.get("/health")
    def health_check():
        return {"status": "ok"}
    
    # Add direct query endpoint (for non-CopilotKit access)
    @app.post("/query", response_model=QueryResponse)
    def query_endpoint(request: QueryRequest):
        """Query endpoint for direct API access (not using CopilotKit)"""
        result = run_conversation_agent(request.user_query, request.conversation_history or [])
        return QueryResponse(**result)
    
    return app


def run_server(host: str = "0.0.0.0", port: int = 8123, reload: bool = True):
    """
    Run the uvicorn server
    """
    print(f"\n{'='*80}")
    print(f"🚀 Starting Sales CRM Conversation Agent Server")
    print(f"{'='*80}")
    print(f"Host: {host}")
    print(f"Port: {port}")
    print(f"Reload: {reload}")
    print(f"CopilotKit Endpoint: http://localhost:{port}/copilotkit")
    print(f"Query Endpoint: http://localhost:{port}/query (POST)")
    print(f"Health Check: http://localhost:{port}/health")
    print(f"{'='*80}\n")
    
    uvicorn.run(
        "conversation_agent:app",
        host=host,
        port=port,
        reload=reload,
    )


# ============================================================================
# ENTRY POINT
# ============================================================================

# Create the app for import by uvicorn
app = create_app()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command in ["test", "interactive", "chat"]:
            # Run interactive terminal testing
            interactive_terminal_test()
        elif command in ["server", "serve", "run"]:
            # Run the FastAPI server
            port = int(sys.argv[2]) if len(sys.argv) > 2 else 8123
            run_server(port=port)
        else:
            print(f"Unknown command: {command}")
            print("\nUsage:")
            print("  python conversation_agent.py test          # Interactive terminal test")
            print("  python conversation_agent.py server [port] # Start FastAPI server (default port 8123)")
    else:
        # Default: run server
        run_server()