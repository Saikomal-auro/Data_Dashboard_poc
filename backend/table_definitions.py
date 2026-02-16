# =============================================================================
# ENHANCED TABLE AND SCHEMA DEFINITIONS WITH BUSINESS CONTEXT
# =============================================================================

# Enhanced table list with business context and descriptions
TABLE_LIST_JSON = {
    "leaddetails": {
        "description": "Stores potential customer leads - the entry point of the sales cycle. A lead represents initial customer interest before conversion to quotation.",
        "business_context": "Leads are prospective customers captured from various sources (website, trade shows, referrals). They go through qualification stages before converting to quotations. Not all leads convert - some are lost to competition or become inactive.",
        "row_count_estimate": "200",
        "common_queries": [
            "Count of leads by status",
            "Lead conversion rate",
            "Leads by industry",
            "Leads created in date range",
            "Leads by source",
            "Unconverted/lost leads"
        ]
    },
    "quotationhdrs": {
        "description": "Stores quotation header information. A quotation is a formal price offer to a customer that may convert to a sale order.",
        "business_context": "Quotations are created after lead qualification or directly for existing customers. They contain pricing, terms, and validity period. Approved quotations can become sale orders.",
        "row_count_estimate": "300",
        "common_queries": [
            "Quotations by status",
            "Quotation value by customer",
            "Quotations created in period",
            "Approved vs rejected quotations",
            "Average quotation value",
            "Quotations expiring soon"
        ]
    },
    "quotationdtls": {
        "description": "Stores quotation line items/details. Each line represents a product item in the quotation with quantity, price, and terms.",
        "business_context": "Line items specify what products are being quoted, at what price, quantity, and terms. Multiple items can be in one quotation header.",
        "row_count_estimate": "600",
        "common_queries": [
            "Items in a quotation",
            "Total value by item",
            "Average discount given",
            "Items by category",
            "High value line items"
        ]
    },
    "saleorderhdrs": {
        "description": "Stores sale order headers. A sale order is a confirmed customer order created from an approved quotation.",
        "business_context": "Sale orders are created when quotations are accepted by customers. They represent committed business and trigger scheduling and dispatch processes.",
        "row_count_estimate": "250",
        "common_queries": [
            "Sale orders by customer",
            "Sale orders by status",
            "Orders in date range",
            "Revenue by organization",
            "Orders pending completion"
        ]
    },
    "saleorderdtls": {
        "description": "Stores sale order line items. Each line represents a product in the sale order with confirmed quantity and price.",
        "business_context": "Line items contain the actual products ordered, their quantities, prices, and delivery terms. These are used to create schedules and dispatches.",
        "row_count_estimate": "500",
        "common_queries": [
            "Items in a sale order",
            "Order value by item",
            "Active order lines",
            "Orders by delivery date"
        ]
    },
    "schedules": {
        "description": "Stores delivery schedules. A schedule defines when and how much quantity will be delivered against a sale order line.",
        "business_context": "Schedules break down sale order quantities into deliverable batches. They track planned vs actual dispatch, and handle rescheduling scenarios.",
        "row_count_estimate": "400",
        "common_queries": [
            "Schedules by date",
            "Pending schedules",
            "Rescheduled items",
            "Dispatch vs scheduled quantity",
            "Schedules by customer",
            "Overdue schedules"
        ]
    },
    "dispatches": {
        "description": "Stores dispatch/shipment headers. A dispatch represents actual goods movement from warehouse to customer.",
        "business_context": "Dispatches are created when goods are shipped against schedules. They track shipment status, invoicing, and delivery confirmation.",
        "row_count_estimate": "200",
        "common_queries": [
            "Dispatches by status",
            "Dispatch value by customer",
            "Dispatches in date range",
            "Pending dispatches",
            "Delivered dispatches",
            "Invoice tracking"
        ]
    },
    "dispatchdetails": {
        "description": "Stores dispatch line items. Each line represents a product dispatched with quantity, value, and packaging details.",
        "business_context": "Line items track individual products in a dispatch shipment, linking back to schedules and sale order lines.",
        "row_count_estimate": "350",
        "common_queries": [
            "Items dispatched",
            "Dispatch value by item",
            "Freight and packing costs",
            "Dispatches by schedule"
        ]
    }
}

# LOOKUP_ENUM_JSON - Predefined value mappings for enum/categorical columns
# These columns have fixed sets of values and should be looked up using get_enum_values tool

# Lookup/Enum mappings for columns that require value translation

# Integrated table schemas with DDL and lookup values
TABLE_SCHEMA_JSON = {
    "leaddetails": {
        "ddl": """CREATE TABLE leaddetails (
    lead_id INTEGER PRIMARY KEY NOT NULL, -- DC: Unique identifier for each lead record
    lead_created_date DATETIME, -- Date and time when the lead was first created
    Last_mod_date DATETIME, -- Date and time of the last modification
    lead_no TEXT, -- Human-readable lead reference number
    leadsource TEXT, -- Origin or channel through which lead was acquired
    leadstatus_id INTEGER, -- ENUM: Current stage in the lead pipeline
    LeadSubStatus TEXT, -- Detailed sub-status providing additional context
    collector TEXT, -- Name of collection team or person assigned
    mc_code TEXT, -- Marketing campaign code
    customer_id INTEGER, -- Reference to customer master record
    customer_name TEXT, -- MDC: Name of the customer
    item_Id INTEGER, -- Reference to product/item of interest
    item_group TEXT, -- Category or classification group of item
    item_description TEXT, -- Detailed description of item/product
    segment1 TEXT, -- Primary product classification segment
    potential REAL, -- Estimated quantity potential for conversion
    potential_value REAL, -- Estimated monetary value of potential deal
    quantity REAL, -- Actual quantity discussed or quoted
    quantity_value REAL, -- Monetary value of actual quantity
    executive_name TEXT, -- Name of sales executive handling lead
    assignto_user_id INTEGER, -- User ID currently assigned to lead
    created_by TEXT, -- Name/identifier of user who created lead
    createdby_id INTEGER, -- User ID of person who created lead
    AccYear TEXT, -- Accounting year when lead was created
    JCPeriod TEXT, -- Journal/Calendar period for accounting
    close_reason_id INTEGER, -- ENUM: Reason why lead was closed
    cvrpotentialdata_headerid INTEGER, -- Reference to conversion potential data
    enquiry_id INTEGER, -- Reference to associated enquiry record
    sent_mail_alert TEXT, -- Flag/timestamp for email alert
    referral_customer_name TEXT, -- Name of referring customer
    referral_customer_number TEXT, -- Contact number of referring customer
    quotation_header_id INTEGER, -- Reference to generated quotation
    sales_type_flag TEXT, -- ENUM: Type of sales transaction classification
    creation_date DATETIME, -- DC: Original creation timestamp
    FOREIGN KEY (quotation_header_id) REFERENCES quotationhdrs(header_id)
);""",
        "lookups": {
            "leadstatus_id": {
                "1": "Prospect - Initial contact stage, potential customer identified",
                "2": "Qualified Lead - Lead vetted and meets qualification criteria",
                "3": "Visit - Sales team scheduled/completed customer visit",
                "4": "Credit Evaluation - Customer creditworthiness being assessed",
                "5": "Sampling/Trials - Product samples provided for testing",
                "6": "Quote - Formal quotation prepared and sent",
                "7": "Converted - Lead successfully converted to sales order",
                "8": "Close - Lead closed permanently (won or lost)",
                "9": "Temporary Close - Lead temporarily closed, may reopen"
            },
            "close_reason_id": {
                "1": "Not in my Territory - Lead outside assigned sales territory",
                "2320": "NULL (No Close Reason) - Default when no reason specified",
                "4": "No requirement now - Customer has no immediate need",
                "5": "Sample rejected - Customer rejected product samples",
                "7": "Company is closed - Customer business shut down",
                "8": "Product is discontinued - Requested product no longer made",
                "9": "Traders Lead - Lead belongs to trading division",
                "10": "Product not dealing - Company doesn't handle this product"
            },
            "sales_type_flag": {
                "0": "Not Applicable - No specific sales type classification",
                "B": "Bulk - Large volume/wholesale sales",
                "R": "Repack - Repackaging sales (breaking bulk into smaller units)"
            }
        }
    },
    
    "quotationhdrs": {
        "ddl": """CREATE TABLE quotationhdrs (
    header_id INTEGER PRIMARY KEY NOT NULL, -- DC: Unique identifier for quotation header
    quotation_number TEXT, -- DC: Human-readable quotation reference number
    quotation_date DATETIME, -- DC: Date when quotation was issued
    enquiry_id INTEGER, -- Reference to original enquiry
    status_id INTEGER, -- ENUM: Current approval and processing status
    trans_type_id INTEGER, -- ENUM: Type of transaction for tax/billing
    trans_sub_type_id INTEGER, -- ENUM: Detailed transaction sub-category
    company_id INTEGER, -- Reference to issuing company/organization
    CompanyName TEXT, -- Name of issuing company
    collector_id INTEGER, -- Reference to collection team/person
    CollectorName TEXT, -- Name of assigned collector
    customer_id INTEGER, -- Reference to customer receiving quotation
    customer_name TEXT, -- MDC: Name of customer
    customergroup TEXT, -- Classification group of customer
    IndustrialSegment TEXT, -- Industry sector/segment of customer
    bill_to_site_id INTEGER, -- Reference to billing location/site
    bill_to_site_Name TEXT, -- Name/address of billing location
    ship_to_site_id INTEGER, -- Reference to shipping/delivery location
    ship_to_site_Name TEXT, -- Name/address of shipping location
    quotation_valid_upto DATETIME, -- Expiration date of quotation validity
    is_back_to_back_order INTEGER, -- Flag for back-to-back order (1=Yes, 0=No)
    Quote_creation_type TEXT, -- Method/source of quotation creation
    created_by INTEGER, -- User ID of creator
    creation_date DATETIME, -- Timestamp when created
    last_updated_by INTEGER, -- User ID of last modifier
    last_update_date DATETIME -- Timestamp of last update
);""",
        "lookups": {
            "trans_type_id": {
                "1": "Taxable - Inter State - Cross-state sales with IGST",
                "4": "Taxable - Intra State - Within-state sales with CGST+SGST",
                "6": "Sample - Sample product transaction (may be non-taxable)",
                "8": "Cogt - Intra State - Cost of Goods Transferred within state",
                "9": "BTS - Bond Transfer Sales (tax-exempt warehouse transfer)",
                "11": "Cogt - Inter State - Cost of Goods Transferred across states"
            },
            "trans_sub_type_id": {
                "1": "Bond Transfer Sales - Transfer between bonded warehouses",
                "3": "Taxable - Delivered - Price includes delivery to customer",
                "4": "Taxable - Ex-Port/Ex-Godown - Customer picks up from warehouse",
                "5": "Taxable - Delivered - Barrel - Delivered with barrel/drum packaging",
                "6": "Taxable - Ex-Port/Ex-Godown - PDC - Ex-warehouse with PDC payment",
                "7": "Taxable - Delivered - PDC - Delivered with PDC payment",
                "8": "Sample - Sample product delivery"
            },
            "status_id": {
                "1": "Open - Quotation created, not yet submitted for approval",
                "2": "CLRPreApproved - Pre-approved by CLR (Credit Limit Review)",
                "3": "Approved - Fully approved by authorized personnel",
                "4": "Rejected - Quotation rejected, will not proceed",
                "5": "ReferredBack - Sent back for revisions/clarification",
                "6": "Confirmed - Customer confirmed acceptance",
                "8": "Closed - Quotation expired or manually closed",
                "9": "Pending - Awaiting action or information",
                "19": "WaitingForApproval - Submitted and awaiting management approval"
            }
        }
    },
    
    "quotationdtls": {
        "ddl": """CREATE TABLE quotationdtls (
    line_id INTEGER PRIMARY KEY NOT NULL, -- DC: Unique identifier for quotation line
    header_id INTEGER, -- DC: Reference to parent quotation header
    item_id INTEGER, -- MDC: Reference to product/item being quoted
    item_description TEXT, -- Detailed description of quoted item
    item_group TEXT, -- Category/group classification of item
    segment1 TEXT, -- Primary product classification segment
    segment2 TEXT, -- Secondary product classification segment
    segment3 TEXT, -- Tertiary product classification segment
    segment4 TEXT, -- Quaternary product classification segment
    segment6 TEXT, -- Additional product classification segment
    uom_code TEXT, -- Unit of measure code (KG, MT, LTR)
    quantity REAL, -- DC: Quantity of item being quoted
    unit_price REAL, -- Price per unit of item
    packing_size REAL, -- Size/volume of packaging for item
    delivery_from_id INTEGER, -- Reference to delivery source location
    delivery_from TEXT, -- Name/description of delivery source
    freight_terms_id INTEGER, -- ENUM: Shipping and delivery responsibility
    sale_category TEXT, -- Category of sale (Domestic, Export)
    payment_term_id INTEGER, -- Reference to applicable payment terms
    payment_term TEXT, -- Description of payment terms
    drum_type TEXT, -- Type of drum/container for packaging
    delivery_date DATETIME, -- Promised/expected delivery date
    inventory_org_id INTEGER, -- Reference to inventory organization
    inventory_org_Name TEXT, -- Name of inventory organization
    item_hsn_code TEXT, -- HSN code for taxation
    tax_percentage REAL, -- Applicable tax percentage for item
    quotation_close_reason TEXT, -- Reason for closing/rejecting line
    status_id INTEGER, -- ENUM: Approval status of quotation line
    created_by INTEGER, -- User ID of creator
    creation_date DATETIME, -- Timestamp when created
    last_updated_by INTEGER, -- User ID of last modifier
    last_update_date DATETIME, -- Timestamp of last update
    FOREIGN KEY (header_id) REFERENCES quotationhdrs(header_id)
);""",
        "lookups": {
            "freight_terms_id": {
                "1": "Ex-Port/Ex-Godown - Customer responsible for pickup and freight",
                "2": "To your Plant/Factory - Seller delivers to customer's location",
                "3": "To-Pay - Ex-Port/Ex Godown - Freight charges billed separately"
            },
            "status_id": {
                "1": "Open - Line item created, not submitted for approval",
                "2": "WaitingForApproval - Submitted and awaiting approval",
                "3": "Approved - Line item approved by authorized personnel",
                "4": "Rejected - Line item rejected, will not proceed",
                "6": "Confirmed - Customer confirmed this line item",
                "8": "Closed - Line item closed (expired, cancelled, or completed)"
            }
        }
    },
    
    "saleorderhdrs": {
        "ddl": """CREATE TABLE saleorderhdrs (
    header_id INTEGER PRIMARY KEY NOT NULL, -- MDC: Unique identifier for sales order header
    quotation_line_id INTEGER, -- DC: Reference to converted quotation line
    quotation_number TEXT, -- DC: Reference number of original quotation
    quotation_date DATETIME, -- Date of original quotation
    enquiry_id INTEGER, -- Reference to original enquiry
    enquiry_date DATETIME, -- Date of original enquiry
    trans_type_id INTEGER, -- ENUM: Type of transaction for tax/billing
    trans_sub_type_id INTEGER, -- ENUM: Detailed transaction sub-category
    organization_id INTEGER, -- Reference to selling organization
    CompanyName TEXT, -- Name of selling organization/company
    customer_id INTEGER, -- Reference to customer placing order
    customer_name TEXT, -- Name of customer placing order
    customergroup TEXT, -- Classification group of customer
    IndustrialSegment TEXT, -- Industry sector/segment of customer
    collector_id INTEGER, -- Reference to collection team/person
    CollectorName TEXT, -- Name of assigned collector
    bill_to_site_id INTEGER, -- Reference to billing location
    bill_to_site_Name TEXT, -- Name/address of billing location
    ship_to_site_id INTEGER, -- Reference to shipping location
    ship_to_site_Name TEXT, -- Name/address of shipping location
    is_back_to_back_order INTEGER, -- Flag for back-to-back order (1=Yes, 0=No)
    quote_creation_type INTEGER, -- ENUM: Source system where quotation was created
    currency TEXT, -- Currency code for transaction (USD, INR)
    customer_po_ref TEXT, -- Customer's purchase order reference number
    customer_po_date DATETIME, -- Date of customer's purchase order
    trading_manufacture TEXT, -- Indicator if trading or manufacturing sale
    created_by INTEGER, -- User ID of creator
    creation_date DATETIME, -- DC: Timestamp when created
    FOREIGN KEY (quotation_line_id) REFERENCES quotationhdrs(header_id)
);""",
        "lookups": {
            "trans_type_id": {
                "1": "Taxable - Inter State - Cross-state sales with IGST",
                "4": "Taxable - Intra State - Within-state sales with CGST+SGST",
                "6": "Sample - Sample product transaction",
                "8": "Cogt - Intra State - Cost of Goods Transferred within state",
                "9": "BTS - Bond Transfer Sales (tax-exempt warehouse transfer)",
                "11": "Cogt - Inter State - Cost of Goods Transferred across states"
            },
            "trans_sub_type_id": {
                "1": "Bond Transfer Sales - Transfer between bonded warehouses",
                "3": "Taxable - Delivered - Price includes delivery to customer",
                "4": "Taxable - Ex-Port/Ex-Godown - Customer picks up from warehouse",
                "5": "Taxable - Delivered - Barrel - Delivered with barrel packaging",
                "6": "Taxable - Ex-Port/Ex-Godown - PDC - Ex-warehouse with PDC payment",
                "7": "Taxable - Delivered - PDC - Delivered with PDC payment",
                "8": "Sample - Sample product delivery"
            },
            "quote_creation_type": {
                "1": "CRM - Quotation created through CRM system",
                "CRM": "Taxable - Intra State - Legacy value for CRM-originated intra-state sale"
            }
        }
    },
    
    "saleorderdtls": {
        "ddl": """CREATE TABLE saleorderdtls (
    line_id INTEGER PRIMARY KEY NOT NULL, -- DC: Unique identifier for sales order line
    header_id INTEGER, -- DC: Reference to parent sales order header
    item_id INTEGER, -- MDC: Reference to product/item being sold
    item_description TEXT, -- Detailed description of item
    item_group TEXT, -- Category/group classification of item
    segment1 TEXT, -- Primary product classification segment
    segment2 TEXT, -- Secondary product classification segment
    segment3 TEXT, -- Tertiary product classification segment
    segment4 TEXT, -- Quaternary product classification segment
    segment6 TEXT, -- Additional product classification segment
    uom_code TEXT, -- Unit of measure code
    quantity REAL, -- DC: Ordered quantity of item
    unit_price REAL, -- Price per unit of item
    packing_size REAL, -- Size/volume of packaging
    delivery_from_id INTEGER, -- Reference to delivery source location
    delivery_from TEXT, -- Name of delivery source location
    freight_terms_id INTEGER, -- ENUM: Shipping and delivery responsibility
    sale_category TEXT, -- Category of sale (Domestic/Export)
    payment_term_id INTEGER, -- Reference to payment terms
    payment_term TEXT, -- Description of payment terms
    drum_type TEXT, -- Type of drum/container
    delivery_date DATETIME, -- Promised delivery date
    inventory_org_id INTEGER, -- Reference to inventory organization
    inventory_org_Name TEXT, -- Name of inventory organization
    item_hsn_code TEXT, -- HSN code for taxation
    tax_percentage REAL, -- Applicable tax percentage
    packing_details TEXT, -- Detailed packing specifications
    created_by INTEGER, -- User ID of creator
    creation_date DATETIME, -- Creation timestamp
    last_updated_by INTEGER, -- User ID of last modifier
    last_update_date DATETIME, -- Last update timestamp
    status TEXT, -- ENUM: Processing status of sale order line
    quotationdtl_line_id INTEGER, -- Reference to original quotation detail line
    AUTO_CLOSE_REASON TEXT, -- System-generated reason for automatic closure
    AUTO_CLOSE_DATE DATETIME, -- Date when line was automatically closed
    FOREIGN KEY (header_id) REFERENCES saleorderhdrs(header_id)
);""",
        "lookups": {
            "freight_terms_id": {
                "1": "Ex-Port/Ex-Godown - Customer responsible for pickup and freight",
                "2": "To your Plant/Factory - Seller delivers to customer's location",
                "3": "To-Pay - Ex-Port/Ex Godown - Freight charges billed separately"
            },
            "status": {
                "OPEN": "Sales Order Line Open - Pending Fulfillment (awaiting dispatch/scheduling)",
                "Closed": "Sales Order Line Closed - Fully Processed (completed, dispatched, or cancelled)"
            }
        }
    },
    
    "schedules": {
        "ddl": """CREATE TABLE schedules (
    line_id INTEGER PRIMARY KEY NOT NULL, -- DC: Unique identifier for schedule line
    sale_order_header_id INTEGER, -- DC: Reference to parent sales order header
    sale_order_detail_line_id INTEGER, -- Reference to sales order detail line
    alternate_item_id INTEGER, -- Reference to alternate item if substitution needed
    item_code TEXT, -- Code of scheduled item
    item_description TEXT, -- Description of scheduled item
    item_group TEXT, -- Group classification of item
    segment1 TEXT, -- Primary product classification segment
    segment2 TEXT, -- Secondary product classification segment
    segment3 TEXT, -- Tertiary product classification segment
    segment4 TEXT, -- Quaternary product classification segment
    segment6 TEXT, -- Additional product classification segment
    sale_category TEXT, -- Category of sale
    customer_id INTEGER, -- Reference to customer
    customer_name TEXT, -- Name of customer
    customergroup TEXT, -- Customer classification group
    IndustrialSegment TEXT, -- Industry segment of customer
    schedule_date DATETIME, -- MDC: Planned delivery/schedule date
    reschedule_date DATETIME, -- New date if schedule rescheduled
    reschedule_reason TEXT, -- Reason for rescheduling
    schedule_time TEXT, -- Planned delivery time
    inventory_org_id INTEGER, -- Reference to inventory organization
    inventory_org_code TEXT, -- Code of inventory organization
    customer_requested_date DATETIME, -- Original date requested by customer
    schedule_quantity REAL, -- DC: Quantity planned for this schedule
    dispatched_quantity REAL, -- Actual quantity dispatched
    dispatched_date DATETIME, -- Date when schedule was dispatched
    dispatched_time TEXT, -- Time when schedule was dispatched
    bill_to_customer_site_id INTEGER, -- Reference to billing site
    bill_to_site_Name TEXT, -- Name of billing site
    ship_to_customer_site_id INTEGER, -- Reference to shipping site
    ship_to_site_Name TEXT, -- Name of shipping site
    schedule_status_id INTEGER, -- ENUM: Current processing status
    confirm_status_id INTEGER, -- ENUM: Whether schedule confirmed or not
    reason_id INTEGER, -- ENUM: Reason for rescheduling
    comments TEXT, -- Additional comments/notes about schedule
    packing_cost REAL, -- Cost associated with packing
    packing_size TEXT, -- Size specification for packing
    order_quantity REAL, -- Total order quantity from parent sales order
    packing_details TEXT, -- Detailed packing specifications
    previous_schedule_quantity REAL, -- Quantity from previous schedule version
    drum_type TEXT, -- Type of drum/container
    frieght_term_id INTEGER, -- ENUM: Shipping and delivery responsibility
    payment_term_id INTEGER, -- Reference to payment terms
    PaymentTerm TEXT, -- Description of payment terms
    tax REAL, -- Tax amount applicable
    backtoback_enable REAL, -- Flag for back-to-back order enablement
    unit_price REAL, -- Price per unit
    organization_id INTEGER, -- Reference to organization
    inventory_org_name TEXT, -- Name of inventory organization
    delivery_from_id INTEGER, -- Reference to delivery source
    delivery_from TEXT, -- Name of delivery source
    reschedule_time TEXT, -- Time of rescheduled delivery
    created_by INTEGER, -- User ID of creator
    creation_date DATETIME, -- Creation timestamp
    last_updated_by INTEGER, -- User ID of last modifier
    last_update_date DATETIME, -- Last update timestamp
    is_mobile_request INTEGER, -- Flag if created via mobile (1=Yes, 0=No)
    Request_from TEXT, -- Source of schedule request (Web/Mobile/System)
    FOREIGN KEY (sale_order_header_id) REFERENCES saleorderhdrs(header_id),
    FOREIGN KEY (sale_order_detail_line_id) REFERENCES saleorderdtls(line_id)
);""",
        "lookups": {
            "schedule_status_id": {
                "1": "Pending - Schedule created, awaiting confirmation/dispatch",
                "3": "Closed - Schedule completed or cancelled",
                "4": "Confirmed - Customer confirmed the delivery schedule",
                "5": "Reject - Schedule rejected by customer or system",
                "6": "SOCConfirmed - Sales Operations Center confirmed schedule"
            },
            "confirm_status_id": {
                "0": "Not Confirmed - Schedule awaiting confirmation",
                "1": "Confirmed - Schedule confirmed by customer/system"
            },
            "reason_id": {
                "1": "Customer Requested - Customer initiated reschedule request",
                "2": "Stock Not Available - Insufficient inventory to fulfill",
                "3": "Logistics Issue - Transportation/delivery problems",
                "4": "Limit Issue - Credit limit or authorization constraints",
                "79": "Quality Issue - Product quality concerns preventing dispatch",
                "82": "Other Customer Limitation - Other customer-side constraints",
                "303": "After Cut-off Time - Request received past daily cutoff",
                "307": "Market Purchase – Under Process - Procurement in progress"
            },
            "frieght_term_id": {
                "1": "Ex-Port/Ex-Godown - Customer responsible for pickup and freight",
                "2": "To your Plant/Factory - Seller delivers to customer's location",
                "3": "To-Pay - Ex-Port/Ex Godown - Freight charges billed separately"
            }
        }
    },
    
    "dispatches": {
        "ddl": """CREATE TABLE dispatches (
    header_id INTEGER PRIMARY KEY NOT NULL, -- DC: Unique identifier for dispatch header
    organization_id INTEGER, -- Reference to dispatching organization
    company_name TEXT, -- Name of dispatching company
    customer_id INTEGER, -- Reference to customer receiving dispatch
    customer_name TEXT, -- Name of customer receiving dispatch
    customergroup TEXT, -- Classification group of customer
    IndustrialSegment TEXT, -- Industry segment of customer
    collector_id INTEGER, -- Reference to collection team
    CollectorName TEXT, -- Name of collector
    bill_to_customer_site_id INTEGER, -- Reference to billing site
    bill_to_site_Name TEXT, -- Name of billing site
    ship_to_customer_site_id INTEGER, -- Reference to shipping site
    ship_to_site_Name TEXT, -- Name of shipping site
    order_type TEXT, -- Type of order being dispatched
    sale_order_header_id INTEGER, -- DC: Reference to source sales order
    order_date DATETIME, -- Date of original sales order
    despatch_status_id INTEGER, -- ENUM: Current processing status of dispatch
    currency TEXT, -- Currency code for transaction
    payment_term_id INTEGER, -- Reference to payment terms
    payment_term_name TEXT, -- Description of payment terms
    sum_of_despatch_quantity REAL, -- Total quantity being dispatched
    inventory_org_id INTEGER, -- Reference to inventory organization
    InvOrgName TEXT, -- Name of inventory organization
    invoice_number TEXT, -- Invoice number generated for dispatch
    invoice_date DATETIME, -- Date of invoice generation
    customer_po_number TEXT, -- Customer's purchase order number
    trans_type_name TEXT, -- Name/description of transaction type
    despatch_confirm_date DATETIME, -- Date when dispatch was confirmed
    despatch_confirm_flag TEXT, -- ENUM: Whether dispatch has been confirmed
    created_by INTEGER, -- User ID of creator
    creation_date DATETIME, -- DC: Creation timestamp
    last_updated_by INTEGER, -- User ID of last modifier
    last_update_date DATETIME, -- Last update timestamp
    FOREIGN KEY (sale_order_header_id) REFERENCES saleorderhdrs(header_id)
);""",
        "lookups": {
            "despatch_status_id": {
                "1": "Pending - Dispatch created, awaiting processing",
                "2": "Confirmed - Dispatch confirmed and ready for shipment",
                "3": "MoveToOracle - Transferred to Oracle ERP for invoicing",
                "4": "InvoiceCancel - Dispatch invoice has been cancelled"
            },
            "despatch_confirm_flag": {
                "Y": "Dispatch Confirmed - Dispatch has been confirmed",
                "911": "Invalid/Error Code - System error or invalid state"
            }
        }
    },
    
    "dispatchdetails": {
        "ddl": """CREATE TABLE dispatchdetails (
    line_id INTEGER PRIMARY KEY NOT NULL, -- DC: Unique identifier for dispatch detail line
    header_id INTEGER, -- DC: Reference to parent dispatch header
    item_id INTEGER, -- Reference to item being dispatched
    item_code TEXT, -- Code of item being dispatched
    item_description TEXT, -- Description of item
    item_group TEXT, -- Group classification of item
    segment1 TEXT, -- Primary product classification segment
    segment2 TEXT, -- Secondary product classification segment
    segment3 TEXT, -- Tertiary product classification segment
    segment4 TEXT, -- Quaternary product classification segment
    segment6 TEXT, -- Additional product classification segment
    uom TEXT, -- Unit of measure
    sale_quantity REAL, -- DC: Quantity being dispatched/sold
    unit_price REAL, -- Price per unit
    schedule_date DATETIME, -- Original scheduled date for dispatch
    sale_category TEXT, -- Category of sale
    packing_cost REAL, -- Cost of packing
    inventory_org_id INTEGER, -- Reference to inventory organization
    inventory_org_code TEXT, -- Code of inventory organization
    schedule_line_id INTEGER, -- Reference to schedule line being fulfilled
    sale_order_header_id INTEGER, -- Reference to sales order header
    sale_order_detail_line_id INTEGER, -- Reference to sales order detail line
    trading_manufacture TEXT, -- Indicator of trading vs manufacturing
    packing_details TEXT, -- Detailed packing specifications
    tax_percentage REAL, -- Applicable tax percentage
    total_value REAL, -- MDC: Total value of dispatch line (quantity × price + taxes)
    basic_price REAL, -- Base price before taxes and charges
    created_by INTEGER, -- User ID of creator
    creation_date DATETIME, -- Creation timestamp
    last_updated_by INTEGER, -- User ID of last modifier
    last_update_date DATETIME, -- Last update timestamp
    FOREIGN KEY (header_id) REFERENCES dispatches(header_id),
    FOREIGN KEY (schedule_line_id) REFERENCES schedules(line_id),
    FOREIGN KEY (sale_order_header_id) REFERENCES saleorderhdrs(header_id),
    FOREIGN KEY (sale_order_detail_line_id) REFERENCES saleorderdtls(line_id)
);""",
        "lookups": {}
    }
}

