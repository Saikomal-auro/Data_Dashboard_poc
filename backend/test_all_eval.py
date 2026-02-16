"""
Comprehensive test file with all evaluation questions and expected SQL queries
Tests the sql_builder_agent from main.py
"""

import sys
import os
sys.path.insert(0, r'c:\Users\ADMIN\Downloads\Work\CVR-poc\backend')

from typing import TypedDict, List, Dict
from langchain_core.messages import SystemMessage
from langchain_openai import AzureChatOpenAI
from dotenv import load_dotenv
from schema import get_database_schema
import sqlparse

load_dotenv()


def format_sql(sql: str) -> str:
    """Pretty-format SQL for readable output"""
    if not sql:
        return ""
    return sqlparse.format(
        sql,
        reindent=True,
        keyword_case="upper"
    )

# All test cases with questions and expected SQL
EVALUATION_TESTS = {

# =====================
# SIMPLE TESTS (6)
# =====================

"S1": {
    "question": "List all leads created in the last 30 days with lead id, company, upload date, and conversion status.",
    "expected_sql": """
        SELECT lead_id, company, uploaded_date, converted
        FROM leaddetails
        WHERE uploaded_date >= date('now', '-30 days');
    """
},

"S2": {
    "question": "Fetch all quotation headers for a given lead including quotation id, quotation date, and total value.",
    "expected_sql": """
        SELECT header_id, quotation_date, total_value
        FROM quotationhdrs
        WHERE lead_crm_soc_no = :lead_id;
    """
},

"S3": {
    "question": "List all quotation line items for a given quotation header.",
    "expected_sql": """
        SELECT line_id, item_id, quantity, unit_price, line_total
        FROM quotationdtls
        WHERE header_id = :quotation_header_id;
    """
},

"S4": {
    "question": "Get all sales orders created between two dates.",
    "expected_sql": """
        SELECT header_id, quotation_line_id, creation_date
        FROM saleorderhdrs
        WHERE creation_date BETWEEN :start_date AND :end_date;
    """
},

"S5": {
    "question": "Show all dispatch headers for a given sales order.",
    "expected_sql": """
        SELECT header_id, despatch_status_id, invoice_date
        FROM dispatches
        WHERE sale_order_header_id = :sale_order_header_id;
    """
},

"S6": {
    "question": "List all dispatch detail lines for a given dispatch header.",
    "expected_sql": """
        SELECT line_id, item_id, sale_quantity, total_value
        FROM dispatchdetails
        WHERE header_id = :dispatch_header_id;
    """
},

# =====================
# MEDIUM TESTS (17)
# =====================

"M1": {
    "question": "For a given lead, list all quotations with date, total value, and approval status.",
    "expected_sql": """
        SELECT header_id, quotation_date, total_value, approval_status_id
        FROM quotationhdrs
        WHERE lead_crm_soc_no = :lead_id;
    """
},

"M2": {
    "question": "For a given quotation, fetch quotation headers and corresponding sales orders if created.",
    "expected_sql": """
        SELECT qh.header_id AS quotation_id,
               sh.header_id AS sales_order_id
        FROM quotationhdrs qh
        LEFT JOIN saleorderhdrs sh
            ON qh.header_id = sh.quotation_line_id
        WHERE qh.header_id = :quotation_header_id;
    """
},

"M3": {
    "question": "List all sales orders with total number of sales order lines.",
    "expected_sql": """
        SELECT sh.header_id, COUNT(sd.line_id) AS line_count
        FROM saleorderhdrs sh
        JOIN saleorderdtls sd ON sh.header_id = sd.header_id
        GROUP BY sh.header_id;
    """
},

"M4": {
    "question": "For a given sales order, list all schedules with scheduled and dispatched quantities.",
    "expected_sql": """
        SELECT line_id,
               schedule_quantity,
               COALESCE(dispatched_quantity, 0) AS dispatched_quantity,
               schedule_status_id
        FROM schedules
        WHERE sale_order_header_id = :sale_order_header_id;
    """
},

"M5": {
    "question": "Find all schedules where scheduled quantity is greater than dispatched quantity.",
    "expected_sql": """
        SELECT line_id,
               schedule_quantity,
               COALESCE(dispatched_quantity, 0) AS dispatched_quantity
        FROM schedules
        WHERE schedule_quantity > COALESCE(dispatched_quantity, 0);
    """
},

"M6": {
    "question": "Get total dispatched quantity and value per sales order.",
    "expected_sql": """
        SELECT sh.header_id,
               SUM(dd.sale_quantity) AS total_dispatched_qty,
               SUM(dd.total_value) AS total_dispatched_value
        FROM saleorderhdrs sh
        JOIN dispatches d ON sh.header_id = d.sale_order_header_id
        JOIN dispatchdetails dd ON d.header_id = dd.header_id
        GROUP BY sh.header_id;
    """
},

"M7": {
    "question": "List dispatches created in the last 30 days with sales order and status.",
    "expected_sql": """
        SELECT d.header_id,
               d.sale_order_header_id,
               d.despatch_status_id
        FROM dispatches d
        WHERE d.creation_date >= date('now', '-30 days');
    """
},

"M8": {
    "question": "For each quotation, show total quoted value and total ordered value.",
    "expected_sql": """
        SELECT qh.header_id,
               SUM(qh.total_value) AS quoted_value,
               SUM(sd.total_sales_price) AS ordered_value
        FROM quotationhdrs qh
        LEFT JOIN saleorderhdrs sh ON qh.header_id = sh.quotation_line_id
        LEFT JOIN saleorderdtls sd ON sh.header_id = sd.header_id
        GROUP BY qh.header_id;
    """
},

"M9": {
    "question": "Identify sales orders that have no dispatch created yet.",
    "expected_sql": """
        SELECT sh.header_id
        FROM saleorderhdrs sh
        LEFT JOIN dispatches d ON sh.header_id = d.sale_order_header_id
        WHERE d.header_id IS NULL;
    """
},

"M10": {
    "question": "For a given item, list quoted, ordered, and scheduled quantities.",
    "expected_sql": """
        SELECT qd.item_id,
               SUM(qd.quantity) AS quoted_qty,
               SUM(sd.quantity) AS ordered_qty,
               SUM(s.schedule_quantity) AS scheduled_qty
        FROM quotationdtls qd
        LEFT JOIN saleorderdtls sd ON qd.line_id = sd.quotationdtl_line_id
        LEFT JOIN schedules s ON sd.line_id = s.sale_order_detail_line_id
        WHERE qd.item_id = :item_id
        GROUP BY qd.item_id;
    """
},

"M11": {
    "question": "Show all dispatch lines mapped to schedules.",
    "expected_sql": """
        SELECT dd.line_id,
               s.schedule_date,
               dd.sale_quantity
        FROM dispatchdetails dd
        JOIN schedules s ON dd.schedule_line_id = s.line_id;
    """
},

"M12": {
    "question": "List customers with more than 3 quotations and no sales orders.",
    "expected_sql": """
        SELECT qh.lead_crm_soc_no,
               COUNT(*) AS quotation_count
        FROM quotationhdrs qh
        LEFT JOIN saleorderhdrs sh ON qh.header_id = sh.quotation_line_id
        WHERE sh.header_id IS NULL
        GROUP BY qh.lead_crm_soc_no
        HAVING COUNT(*) > 3;
    """
},

"M13": {
    "question": "For each collector, show number of sales orders and total dispatched value.",
    "expected_sql": """
        SELECT sh.collector_id,
               COUNT(DISTINCT sh.header_id) AS order_count,
               SUM(dd.total_value) AS dispatched_value
        FROM saleorderhdrs sh
        JOIN dispatches d ON sh.header_id = d.sale_order_header_id
        JOIN dispatchdetails dd ON d.header_id = dd.header_id
        GROUP BY sh.collector_id;
    """
},

"M14": {
    "question": "Find approved quotations that are expired.",
    "expected_sql": """
        SELECT header_id, quotation_valid_upto
        FROM quotationhdrs
        WHERE approval_status_id = :approved_status
          AND quotation_valid_upto < date('now');
    """
},

"M15": {
    "question": "List sales orders where any schedule was rescheduled.",
    "expected_sql": """
        SELECT DISTINCT sale_order_header_id
        FROM schedules
        WHERE reschedule_date IS NOT NULL;
    """
},

"M16": {
    "question": "Get dispatch lines where dispatched quantity exceeds scheduled quantity.",
    "expected_sql": """
        SELECT dd.line_id,
               dd.sale_quantity,
               s.schedule_quantity
        FROM dispatchdetails dd
        JOIN schedules s ON dd.schedule_line_id = s.line_id
        WHERE dd.sale_quantity > s.schedule_quantity;
    """
},

"M17": {
    "question": "Show quotation to sales order to dispatch mapping for a given quotation.",
    "expected_sql": """
        SELECT qh.header_id AS quotation_id,
               sh.header_id AS sales_order_id,
               d.header_id AS dispatch_id
        FROM quotationhdrs qh
        LEFT JOIN saleorderhdrs sh ON qh.header_id = sh.quotation_line_id
        LEFT JOIN dispatches d ON sh.header_id = d.sale_order_header_id
        WHERE qh.header_id = :quotation_header_id;
    """
},

# =====================
# HARD TESTS (7)
# =====================

"H1": {
    "question": "For a given lead, show the entire lifecycle from lead to dispatch.",
    "expected_sql": """
        SELECT *
        FROM leaddetails l
        LEFT JOIN quotationhdrs qh ON l.lead_id = qh.lead_crm_soc_no
        LEFT JOIN saleorderhdrs sh ON qh.header_id = sh.quotation_line_id
        LEFT JOIN saleorderdtls sd ON sh.header_id = sd.header_id
        LEFT JOIN schedules s ON sd.line_id = s.sale_order_detail_line_id
        LEFT JOIN dispatches d ON sh.header_id = d.sale_order_header_id
        LEFT JOIN dispatchdetails dd ON d.header_id = dd.header_id
        WHERE l.lead_id = :lead_id;
    """
},

"H2": {
    "question": "Calculate lead conversion efficiency.",
    "expected_sql": """
        SELECT
            COUNT(DISTINCT l.lead_id) AS total_leads,
            COUNT(DISTINCT qh.header_id) AS quoted,
            COUNT(DISTINCT sh.header_id) AS ordered,
            COUNT(DISTINCT d.header_id) AS dispatched
        FROM leaddetails l
        LEFT JOIN quotationhdrs qh ON l.lead_id = qh.lead_crm_soc_no
        LEFT JOIN saleorderhdrs sh ON qh.header_id = sh.quotation_line_id
        LEFT JOIN dispatches d ON sh.header_id = d.sale_order_header_id;
    """
},

"H3": {
    "question": "For each lead, compute quoted, ordered, dispatched value and leakage.",
    "expected_sql": """
        SELECT l.lead_id,
               SUM(qh.total_value) AS quoted_value,
               SUM(sd.total_sales_price) AS ordered_value,
               SUM(dd.total_value) AS dispatched_value,
               SUM(qh.total_value) - SUM(sd.total_sales_price) AS leakage
        FROM leaddetails l
        LEFT JOIN quotationhdrs qh ON l.lead_id = qh.lead_crm_soc_no
        LEFT JOIN saleorderhdrs sh ON qh.header_id = sh.quotation_line_id
        LEFT JOIN saleorderdtls sd ON sh.header_id = sd.header_id
        LEFT JOIN dispatches d ON sh.header_id = d.sale_order_header_id
        LEFT JOIN dispatchdetails dd ON d.header_id = dd.header_id
        GROUP BY l.lead_id;
    """
},

"H4": {
    "question": "Identify quantity mismatch across quotation, order, and dispatch.",
    "expected_sql": """
        SELECT qd.line_id,
               qd.quantity AS quoted_qty,
               sd.quantity AS ordered_qty,
               dd.sale_quantity AS dispatched_qty
        FROM quotationdtls qd
        LEFT JOIN saleorderdtls sd ON qd.line_id = sd.quotationdtl_line_id
        LEFT JOIN schedules s ON sd.line_id = s.sale_order_detail_line_id
        LEFT JOIN dispatchdetails dd ON s.line_id = dd.schedule_line_id
        WHERE qd.quantity != sd.quantity
           OR sd.quantity != dd.sale_quantity;
    """
},

"H5": {
    "question": "Find dispatches delayed beyond agreed days.",
    "expected_sql": """
        SELECT d.header_id,
               d.despatch_confirm_date,
               qh.quotation_date,
               sh.agreeddays
        FROM dispatches d
        JOIN saleorderhdrs sh ON d.sale_order_header_id = sh.header_id
        JOIN quotationhdrs qh ON sh.quotation_line_id = qh.header_id
        WHERE julianday(d.despatch_confirm_date) - julianday(qh.quotation_date) > sh.agreeddays;
    """
},

"H6": {
    "question": "For each item show quoted, ordered, scheduled, and dispatched quantities.",
    "expected_sql": """
        SELECT qd.item_id,
               SUM(qd.quantity) AS quoted_qty,
               SUM(sd.quantity) AS ordered_qty,
               SUM(s.schedule_quantity) AS scheduled_qty,
               SUM(dd.sale_quantity) AS dispatched_qty
        FROM quotationdtls qd
        LEFT JOIN saleorderdtls sd ON qd.line_id = sd.quotationdtl_line_id
        LEFT JOIN schedules s ON sd.line_id = s.sale_order_detail_line_id
        LEFT JOIN dispatchdetails dd ON s.line_id = dd.schedule_line_id
        GROUP BY qd.item_id;
    """
},

"H7": {
    "question": "Build a full traceability report for a given dispatch header.",
    "expected_sql": """
        SELECT dd.line_id AS dispatch_line,
               s.line_id AS schedule_line,
               sd.line_id AS so_line,
               sh.header_id AS so_header,
               qd.line_id AS quotation_line,
               qh.header_id AS quotation_header,
               l.lead_id
        FROM dispatchdetails dd
        JOIN dispatches d ON dd.header_id = d.header_id
        JOIN schedules s ON dd.schedule_line_id = s.line_id
        JOIN saleorderdtls sd ON s.sale_order_detail_line_id = sd.line_id
        JOIN saleorderhdrs sh ON sd.header_id = sh.header_id
        JOIN quotationhdrs qh ON sh.quotation_line_id = qh.header_id
        JOIN quotationdtls qd ON qh.header_id = qd.header_id
        JOIN leaddetails l ON qh.lead_crm_soc_no = l.lead_id
        WHERE d.header_id = :dispatch_header_id;
    """
}
}


def normalize_sql(sql: str) -> str:
    """Normalize SQL for comparison - remove whitespace and convert to lowercase"""
    return " ".join(sql.split()).lower()

def generate_sql_with_llm(question: str, schema: str) -> str:
    """Generate SQL using the LLM"""
    llm = AzureChatOpenAI(
        azure_endpoint="https://model-gpt-ap001.openai.azure.com",
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version="2024-02-15-preview",
        deployment_name="gpt-4o-mini",
        temperature=0
    )
    
    prompt = f"""
You are an expert SQLite query builder.

DATABASE SCHEMA:
{schema}

User Query: {question}

CRITICAL SQLite REQUIREMENTS:
1. Use date('now') for current date
2. Date functions: strftime(), julianday()
3. No RIGHT JOIN or FULL OUTER JOIN
4. Use LIMIT, not TOP
5. Use SUBSTR(), not SUBSTRING()
6. Boolean: 0 (false), 1 (true)
7. String concat: ||

QUERY GUIDELINES:
- Use proper JOINs based on FK relationships
- Add table aliases (ld, qh, sod, etc.) where helpful
- Use aggregate functions when summarizing
- ONLY add LIMIT if the user explicitly requests it

RESPOND WITH ONLY THE SQL QUERY (no markdown, no explanation):
"""
    
    response = llm.invoke([SystemMessage(content=prompt)])
    sql = response.content.strip().replace("```sql", "").replace("```", "").strip()
    return sql

def run_all_tests():
    """Run all evaluation tests"""
    schema = get_database_schema()
    
    print("\n" + "="*120)
    print("COMPREHENSIVE SQL GENERATION TEST - ALL EVALUATION QUESTIONS")
    print("="*120)
    
    results = {
        "passed": [],
        "failed": [],
        "errors": []
    }
    
    total_tests = len(EVALUATION_TESTS)
    test_num = 1
    
    for test_id in sorted(EVALUATION_TESTS.keys()):
        test = EVALUATION_TESTS[test_id]
        
        # Determine difficulty
        difficulty = test_id[0]
        diff_labels = {"S": "SIMPLE", "M": "MEDIUM", "H": "HARD"}
        
        print(f"\n\n{'─'*120}")
        print(f"[{test_num}/{total_tests}] TEST {test_id} ({diff_labels[difficulty]})")
        print(f"{'─'*120}")
        
        print(f"\n❓ Question:\n   {test['question']}")
        try:
            print(f"\n⏳ Generating SQL with LLM...")
            generated = generate_sql_with_llm(test['question'], schema)
            
            print(f"\n✅ Generated SQL:\n{format_sql(generated)}")

            
            # Normalize and compare
            gen_norm = normalize_sql(generated)
            exp_norm = normalize_sql(test['expected_sql'])
            
            if gen_norm == exp_norm:
                print(f"\n🎉 PASS - Queries match!")
                results["passed"].append(test_id)


        except Exception as e:
            print(f"\n⚠️  ERROR: {str(e)}")
            results["errors"].append(test_id)
        
        test_num += 1
    
    # Summary
    print(f"\n\n{'='*120}")
    print("TEST SUMMARY")
    print(f"{'='*120}\n")
    
    passed = len(results["passed"])
    failed = len(results["failed"])
    errors = len(results["errors"])
    
    print(f"✅ Passed: {passed}/{total_tests}")
    print(f"❌ Failed: {failed}/{total_tests}")
    print(f"⚠️  Errors: {errors}/{total_tests}")
    print(f"\n📊 Success Rate: {(passed/total_tests)*100:.1f}%")
    
    if results["passed"]:
        print(f"\n✅ Passed Tests: {', '.join(results['passed'])}")
    
    if results["failed"]:
        print(f"\n❌ Failed Tests: {', '.join(results['failed'])}")
    
    if results["errors"]:
        print(f"\n⚠️  Error Tests: {', '.join(results['errors'])}")
    
    print("\n" + "="*120)

if __name__ == "__main__":
    run_all_tests()
