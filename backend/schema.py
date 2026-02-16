def get_database_schema():
    """Return the database schema documentation"""
    return schema


schema="""

-- =====================================================
-- LEAD MANAGEMENT MODULE
-- =====================================================

CREATE TABLE leaddetails  -- Stores master lead and prospect information, including customer identity, status, source, approvals, and conversion indicators
(
    lead_id INTEGER PRIMARY KEY NOT NULL,
    lead_crm_soc_no TEXT,  -- FOREIGN KEY: References header_id in quotationhdrs table. Links lead to associated quotation
    lead_no TEXT,
    email_id TEXT,
    interest TEXT,
    firstname TEXT,
    salutation TEXT,
    lastname TEXT,
    industry TEXT,
    website TEXT,
    user_branch TEXT,
    converted INTEGER,
    designation TEXT,
    actionable TEXT,
    comments TEXT,
    producttype TEXT,
    exporttype TEXT,
    presentsource TEXT,
    decisionmaker TEXT,
    domestic_supplier_name TEXT,
    uploaded_date DATETIME,
    nextstepdate TEXT,
    collector TEXT,
    description TEXT,
    assignleadchk INTEGER,
    leadstatus TEXT,
    leadsource TEXT,
    company INTEGER,
    customer_id TEXT,
    sent_mail_alert TEXT,
    detailed_description TEXT,
    gen_lead_status TEXT,
    lead_close_status TEXT,
    lead_close_option TEXT,
    lead_close_comments TEXT,
    crd_id TEXT,
    crd_assesment TEXT,
    lead_2pa_no TEXT,
    sales_type_flag TEXT,
    app_sync_flag INTEGER,
    app_lead_id INTEGER,
    approval_date DATETIME,
    approve_comments TEXT,
    user_submited DATETIME,
    log_id TEXT,
    approve_status TEXT,
    customername TEXT,
    segment1 TEXT,
    lead_cust_number TEXT,
    business_type TEXT,
    lead_comments TEXT,
    comp_name TEXT,
    comp_prod_category TEXT,
    comp_price REAL,
    created_by TEXT,
    creation_date DATETIME,
    last_updated_by TEXT,
    last_update_date DATETIME,
    visit_date DATETIME,
    is_visited INTEGER,
    is_credit_evaluated INTEGER,
    is_temp_customer INTEGER,
    previous_quote_id INTEGER,
    enquiry_id INTEGER,
    close_sent_mail_alert TEXT,
    close_approval_id INTEGER,
    mcassign_sent_mail_alert TEXT,
    referral_customer_number INTEGER,
    referral_customer_name TEXT,
    is_notes_request_mail_sent INTEGER,
    cvrpotentialdata_headerid TEXT,
    temp_close_status_id INTEGER,
    close_reason_id INTEGER,
    user_mc_code TEXT,
    cross_marketcircle_segmentaccess_flag INTEGER,
    Bill_to_Site_Use_id INTEGER,
    pre_lead_id INTEGER,
    
    CONSTRAINT fk_leaddetails_quotation FOREIGN KEY (lead_crm_soc_no) 
        REFERENCES quotationhdrs(header_id)
);

-- COLUMN PRIORITY for leaddetails
-- MANDATORY: customername
-- OPTIONAL (Priority 1): lead_id, leadstatus, creation_date
-- OPTIONAL (Priority 2): email_id, industry, collector
-- OPTIONAL (Priority 3): company, producttype, leadsource

-- =====================================================
-- QUOTATION MANAGEMENT MODULE
-- =====================================================

CREATE TABLE quotationhdrs  -- Stores quotation header information including customer, pricing totals, validity dates, approval status, and commercial terms
(
    header_id INTEGER PRIMARY KEY NOT NULL,
    quotation_number TEXT,
    quotation_date DATETIME,
    customer_name TEXT,
    enquiry_id INTEGER,
    trans_type_id INTEGER,
    trans_sub_type_id INTEGER,
    company_id INTEGER,
    company_gstin_id INTEGER,
    company_location_id INTEGER,
    collector_id INTEGER,
    customer_id TEXT,
    bill_to_site_id INTEGER,
    ship_to_site_id INTEGER,
    status_id INTEGER,
    reason_id INTEGER,
    approval_status_id INTEGER,
    remarks TEXT,
    quotation_valid_upto DATETIME,
    is_back_to_back_order INTEGER,
    approval_received_date DATETIME,
    additional_mail_id TEXT,
    CUST_ACCT_SITE_ID INTEGER,
    quote_creation_type INTEGER,
    trans_type_name TEXT,
    sequence_no INTEGER,
    created_by INTEGER,
    creation_date DATETIME,
    last_updated_by INTEGER,
    last_update_date DATETIME,
    sync_error_msg TEXT,
    export_contractid INTEGER,
    export_contractno TEXT,
    sfa_quoteid INTEGER,
    po_comments TEXT,
    synremarks TEXT,
    buyer_order_no TEXT,
    buyer_order_date DATETIME,
    other_ref TEXT,
    currency_type TEXT,
    conversion_rate REAL,
    ie_code INTEGER,
    delivery_terms TEXT,
    pre_carriage_by TEXT,
    port_loading_id INTEGER,
    port_discharge_id INTEGER,
    country_final_dest_id INTEGER,
    final_destination_id INTEGER,
    partial_shipment TEXT,
    type_of_supply TEXT,
    kind_of_package TEXT,
    type_of_container TEXT,
    total_value REAL,
    total_freight_value REAL,
    total_insurance_value TEXT,
    total_fob_value TEXT,
    time_of_dispatch TEXT,
    offer_validity TEXT,
    trans_shipment TEXT,
    number_in_words TEXT,
    bank_id INTEGER,
    agent_id INTEGER,
    commission_value REAL,
    export_remarks TEXT,
    billing_devision_id INTEGER,
    conversion_rate_date DATETIME,
    conversion_type INTEGER,
    price_list_id INTEGER,
    price_list TEXT,
    delivery_description TEXT,
    is_pdf_sent TEXT,
    close_status_id TEXT,
    customer_hdr_id INTEGER,
    is_prequote INTEGER,
    mc_code TEXT,
    pre_quote_id INTEGER,
    is_customer_approval INTEGER,
    is_customer_referback INTEGER,
    is_customer_reject INTEGER,
    othercollectorBM_mailsentflag INTEGER,
    revised_count INTEGER,
    rma_hdr_id INTEGER,
    copy_quote_id INTEGER,
    customer_contact_request_hdr_id INTEGER,
    cus_mail_id TEXT,
    user_mc_code TEXT,
    crossmarketcircle_segmentflag INTEGER,
    internal_parent_quotation_id INTEGER,
    referback_user_id INTEGER,
    referback_prev_status INTEGER,
    is_edit_access INTEGER,
    sample_lead_id INTEGER,
    Verify_StatusId INTEGER,
    Verify_Comments TEXT,
    Verify_Reasons TEXT,
    is_Itemlevel_edited INTEGER,
    is_POlevel_edited INTEGER,
    DmsHdrId INTEGER,
    is_Walkin_quote INTEGER
);

-- COLUMN PRIORITY for quotationhdrs
-- MANDATORY: customer_name
-- OPTIONAL (Priority 1): header_id, quotation_number, quotation_date
-- OPTIONAL (Priority 2): total_value, status_id, approval_status_id
-- OPTIONAL (Priority 3): currency_type, remarks, trans_type_name

CREATE TABLE quotationdtls  -- Stores individual quotation line items with product details, quantities, pricing, discounts, taxes, and compliance attributes
(
    line_id INTEGER PRIMARY KEY NOT NULL,
    header_id INTEGER,  -- FOREIGN KEY: References header_id in quotationhdrs table. Links line item to parent quotation header
    item_id INTEGER,
    uom_code TEXT,
    quantity REAL,
    unit_price REAL,
    total_sales_price TEXT,
    price_list_name TEXT,
    price_list_id TEXT,
    discount_type TEXT,
    discount_percentage REAL,
    packing_size TEXT,
    delivery_from_id INTEGER,
    freight_terms_id INTEGER,
    sale_category TEXT,
    payment_term_id INTEGER,
    drum_type TEXT,
    make TEXT,
    delivery_date DATETIME,
    inventory_org_id INTEGER,
    item_hsn_code TEXT,
    tax_percentage REAL,
    discount_value REAL,
    quotation_close_reason TEXT,
    reason_id INTEGER,
    item_group TEXT,
    price_list_flag TEXT,
    price_list TEXT,
    packing_details TEXT,
    status_id TEXT,
    created_by INTEGER,
    creation_date DATETIME,
    last_updated_by TEXT,
    last_update_date DATETIME,
    export_contract_itemid INTEGER,
    export_contract_itemcode TEXT,
    alais_item_description TEXT,
    shipping_marks TEXT,
    no_of_packs TEXT,
    net_wt_per_pack TEXT,
    origin_id TEXT,
    export_item_hsncode TEXT,
    type_id TEXT,
    PM_id TEXT,
    is_pm_approved TEXT,
    PM_division TEXT,
    threshold_type TEXT,
    threshold_type_description TEXT,
    threshold_count TEXT,
    threshold_price TEXT,
    BH_id TEXT,
    segment3 TEXT,
    MSP_type_description TEXT,
    MSP_oracle_price TEXT,
    MSP_CRM_price TEXT,
    DH_id TEXT,
    segment2 TEXT,
    license_type TEXT,
    license_classification TEXT,
    license_renewal_type TEXT,
    license_solvent_qty TEXT,
    license_id TEXT,
    od_id TEXT,
    ed_id TEXT,
    license_desc TEXT,
    agreeddays INTEGER,
    is_license_restriction TEXT,
    is_license_permanent_exception TEXT,
    unicommerce_order_dtl_ids TEXT,
    unicommerce_sale_order_item_ids TEXT,
    rma_dtl_id TEXT,
    freight_term_desc TEXT,
    is_normal_quote TEXT,
    is_exxsol_quote TEXT,
    is_threshold_quote TEXT,
    is_msp_bh_quote TEXT,
    is_msp_dh_quote TEXT,
    is_license_quote TEXT,
    is_freight_term_quote TEXT,
    is_clr_approval_quote TEXT,
    is_ship_to_state_quote TEXT,
    clr_approval_desc TEXT,
    ship_to_state_desc TEXT,
    clr_approval_role_id TEXT,
    clr_approval_comments TEXT,
    threshold_comments TEXT,
    internal_source_flag INTEGER,
    internal_source_invorg_id INTEGER,
    internal_parent_quotationdtl_id TEXT,
    MROD TEXT,
    DmsLineId TEXT,
    
    CONSTRAINT fk_quotationdtls_header FOREIGN KEY (header_id) 
        REFERENCES quotationhdrs(header_id)
);

-- COLUMN PRIORITY for quotationdtls
-- MANDATORY: item_id
-- OPTIONAL (Priority 1): line_id, header_id, quantity
-- OPTIONAL (Priority 2): unit_price, total_sales_price, tax_percentage
-- OPTIONAL (Priority 3): packing_size, delivery_date, discount_percentage

-- =====================================================
-- SALES ORDER MANAGEMENT MODULE
-- =====================================================

CREATE TABLE saleorderhdrs  -- Stores sales order headers created from quotations, capturing customer, order dates, currency, and contractual details
(
    header_id INTEGER PRIMARY KEY NOT NULL,
    quotation_line_id INTEGER,  -- FOREIGN KEY: References header_id in quotationhdrs table. Links sales order to approved quotation
    quotation_number TEXT,
    quotation_date DATETIME,
    enquiry_id INTEGER,
    trans_type_id INTEGER,
    trans_sub_type_id INTEGER,
    organization_id INTEGER,
    company_location_id INTEGER,
    collector_id INTEGER,
    customer_id INTEGER,
    bill_to_site_id INTEGER,
    ship_to_site_id INTEGER,
    quote_status_id INTEGER,
    quotation_valid_upto DATETIME,
    is_back_to_back_order INTEGER,
    additional_mail_id TEXT,
    CUST_ACCT_SITE_ID INTEGER,
    quote_creation_type INTEGER,
    trans_type_name TEXT,
    currency TEXT,
    customer_po_ref TEXT,
    customer_po_date DATETIME,
    po_received_date DATETIME,
    Conversion_rate_date DATETIME,
    conversion_type INTEGER,
    conversion_rate REAL,
    credit_limit_alert TEXT,
    oracle_sales_person_id INTEGER,
    oracle_sales_person_code TEXT,
    invoice_type TEXT,
    trading_manufacture TEXT,
    remarks TEXT,
    currency_price_list TEXT,
    currency_price_list_id INTEGER,
    branchwise_alert TEXT,
    created_by INTEGER,
    creation_date DATETIME,
    last_updated_by TEXT,
    export_contractid INTEGER,
    export_contractno TEXT,
    broker_id INTEGER,
    internal_parent_schedule_id INTEGER,
    Branchwise_alert_Sentdate DATETIME,
    DmsHdrId TEXT,
    
    CONSTRAINT fk_saleorderhdrs_quotation FOREIGN KEY (quotation_line_id) 
        REFERENCES quotationhdrs(header_id)
);

-- COLUMN PRIORITY for saleorderhdrs
-- MANDATORY: header_id
-- OPTIONAL (Priority 1): quotation_line_id, creation_date, customer_id
-- OPTIONAL (Priority 2): currency, customer_po_ref, trans_type_name
-- OPTIONAL (Priority 3): remarks, conversion_rate, invoice_type

CREATE TABLE saleorderdtls  -- Stores sales order line items detailing products sold, quantities, unit prices, discounts, and calculated sales values
(
    line_id INTEGER PRIMARY KEY NOT NULL,
    header_id INTEGER,  -- FOREIGN KEY: References header_id in saleorderhdrs table. Links line item to parent sales order header
    item_id INTEGER,
    uom_code TEXT,
    quantity REAL,
    unit_price REAL,
    price_list_name TEXT,
    price_list_id INTEGER,
    discount_type INTEGER,
    discount_percentage REAL,
    total_sales_price REAL,
    packing_size TEXT,
    delivery_from_id INTEGER,
    freight_terms_id INTEGER,
    sale_category TEXT,
    payment_term_id INTEGER,
    drum_type TEXT,
    make TEXT,
    delivery_date DATETIME,
    inventory_org_id INTEGER,
    item_hsn_code TEXT,
    tax_percentage REAL,
    quotation_close_reason TEXT,
    reason_id INTEGER,
    item_group TEXT,
    price_list_flag TEXT,
    discount_value REAL,
    price_list TEXT,
    packing_details TEXT,
    created_by INTEGER,
    creation_date DATETIME,
    last_updated_by TEXT,
    last_update_date DATETIME,
    status TEXT,
    quotationdtl_line_id INTEGER,
    export_contract_itemid INTEGER,
    export_contract_itemcode TEXT,
    agreeddays INTEGER,
    internal_source_flag INTEGER,
    internal_source_invorg_id INTEGER,
    internal_parent_schedule_id INTEGER,
    AUTO_CLOSE_REASON TEXT,
    AUTO_CLOSE_DATE DATETIME,
    DmsLineId TEXT,
    
    CONSTRAINT fk_saleorderdtls_header FOREIGN KEY (header_id) 
        REFERENCES saleorderhdrs(header_id)
);

-- COLUMN PRIORITY for saleorderdtls
-- MANDATORY: item_id
-- OPTIONAL (Priority 1): line_id, header_id, quantity
-- OPTIONAL (Priority 2): unit_price, total_sales_price, tax_percentage
-- OPTIONAL (Priority 3): delivery_date, packing_size, discount_percentage

-- =====================================================
-- DELIVERY SCHEDULING MODULE
-- =====================================================

CREATE TABLE schedules  -- Stores delivery and fulfillment schedules linked to sales order lines, tracking quantities, dates, and dispatch readiness
(
    line_id INTEGER PRIMARY KEY NOT NULL,
    sale_order_header_id INTEGER,  -- FOREIGN KEY: References header_id in saleorderhdrs table. Links schedule to parent sales order header
    sale_order_detail_line_id INTEGER,  -- FOREIGN KEY: References line_id in saleorderdtls table. Links schedule to specific sales order line item
    item_id INTEGER,
    alternate_item_id INTEGER,
    sale_category TEXT,
    customer_id INTEGER,
    schedule_date DATETIME,
    reschedule_date DATETIME,
    reschedule_reason TEXT,
    schedule_time TEXT,
    inventory_org_id INTEGER,
    customer_requested_date DATETIME,
    schedule_quantity REAL,
    dispatched_quantity REAL,
    dispatched_date DATETIME,
    dispatched_time TEXT,
    bill_to_customer_site_id INTEGER,
    ship_to_customer_site_id INTEGER,
    schedule_status_id INTEGER,
    soc_status_id INTEGER,
    confirm_status_id INTEGER,
    reason_id INTEGER,
    comments TEXT,
    schedule_approval_status_id INTEGER,
    packing_cost REAL,
    packing_size TEXT,
    order_quantity REAL,
    packing_details TEXT,
    cust_acct_site_id INTEGER,
    previous_schedule_quantity REAL,
    drum_type TEXT,
    frieght_term_id INTEGER,
    item_group TEXT,
    payment_term_id INTEGER,
    tax REAL,
    backtoback_enable INTEGER,
    unit_price REAL,
    quotation_no TEXT,
    organization_id INTEGER,
    inventory_org_name TEXT,
    inventory_org_code TEXT,
    delivery_from_id INTEGER,
    reschedule_time TEXT,
    created_by INTEGER,
    creation_date DATETIME,
    last_updated_by TEXT,
    last_update_date DATETIME,
    agreeddays INTEGER,
    is_mobile_request INTEGER,
    unicommerce_validation_error_message TEXT,
    unicommerce_sale_order_item_ids TEXT,
    request_type TEXT,
    internal_source_flag INTEGER,
    internal_source_invorg_id INTEGER,
    internal_source_quotecreation_flag INTEGER,
    internal_source_dataeditable_flag INTEGER,
    internal_child_schedule_id INTEGER,
    internal_parent_schedule_id INTEGER,
    internal_parent_soc_id INTEGER,
    shedule_data_edit_flag INTEGER,
    is_recall INTEGER,
    
    CONSTRAINT fk_schedules_saleorder_hdr FOREIGN KEY (sale_order_header_id) 
        REFERENCES saleorderhdrs(header_id),
    CONSTRAINT fk_schedules_saleorder_dtl FOREIGN KEY (sale_order_detail_line_id) 
        REFERENCES saleorderdtls(line_id)
);

-- COLUMN PRIORITY for schedules
-- MANDATORY: schedule_date
-- OPTIONAL (Priority 1): line_id, sale_order_header_id, schedule_quantity
-- OPTIONAL (Priority 2): dispatched_quantity, schedule_status_id, customer_id
-- OPTIONAL (Priority 3): item_id, packing_details, comments

-- =====================================================
-- DISPATCH MANAGEMENT MODULE
-- =====================================================

CREATE TABLE dispatches  -- Stores dispatch header records representing shipment events, aggregated dispatched quantities, values, and invoicing metadata
(
    header_id INTEGER PRIMARY KEY NOT NULL,
    sale_order_header_id INTEGER,  -- FOREIGN KEY: References header_id in saleorderhdrs table. Links dispatch to originating sales order
    organization_id INTEGER,
    customer_id INTEGER,
    collector_id INTEGER,
    bill_to_customer_site_id INTEGER,
    ship_to_customer_site_id INTEGER,
    order_type TEXT,
    order_date TEXT,
    price_list REAL,
    sales_person_id INTEGER,
    despatch_status_id INTEGER,
    currency TEXT,
    payment_term_id INTEGER,
    financial_year INTEGER,
    oracle_user_id TEXT,
    customer_po_number TEXT,
    order_type_id INTEGER,
    price_list_id INTEGER,
    sum_of_despatch_quantity REAL,
    inventory_org_id INTEGER,
    shipfrom_org_id INTEGER,
    oracle_soc_number TEXT,
    customer_trx_id TEXT,
    trx_number TEXT,
    trx_date TEXT,
    sum_of_despatch_value REAL,
    trans_type_id INTEGER,
    trans_type_name TEXT,
    conversion_rate REAL,
    sales_person_code TEXT,
    oracle_soc_header_id INTEGER,
    oracle_status TEXT,
    Cancel_reason TEXT,
    cancel_status_flag TEXT,
    despatch_alert_flag TEXT,
    despatch_confirm_date DATETIME,
    despatch_confirm_flag TEXT,
    trip_id INTEGER,
    requisition_header_id INTEGER,
    invoice_no TEXT,
    invoice_date DATETIME,
    created_by INTEGER,
    creation_date DATETIME,
    last_updated_by INTEGER,
    last_update_date DATETIME,
    mail_sent_date TEXT,
    DispatchViewFlag TEXT,
    DispatchViewDate TEXT,
    agreeddays INTEGER,
    REQUISITION_Number TEXT,
    REQUISITION_Date TEXT,
    Vehicle_tracking_link TEXT,
    Vehicle_tracking_ApiRespons TEXT,
    unicommerce_validation_error_message TEXT,
    Is_COA_Attached TEXT,
    Is_drop_shipment_GrnSync INTEGER,
    Tanker_Cleaning_Certificate_Download_Flag TEXT,
    error_log TEXT,
    
    CONSTRAINT fk_dispatches_saleorder FOREIGN KEY (sale_order_header_id) 
        REFERENCES saleorderhdrs(header_id)
);

-- COLUMN PRIORITY for dispatches
-- MANDATORY: sum_of_despatch_value
-- OPTIONAL (Priority 1): header_id, sale_order_header_id, creation_date
-- OPTIONAL (Priority 2): sum_of_despatch_quantity, customer_id, invoice_no
-- OPTIONAL (Priority 3): despatch_status_id, currency, invoice_date

CREATE TABLE dispatchdetails  -- Stores dispatched line-level records linking shipments to schedules and sales orders with quantities and pricing
(
    line_id INTEGER PRIMARY KEY NOT NULL,
    header_id INTEGER,  -- FOREIGN KEY: References header_id in dispatches table. Links dispatch line to parent dispatch header
    schedule_line_id INTEGER,  -- FOREIGN KEY: References line_id in schedules table. Links dispatch to specific scheduled delivery
    sale_order_header_id INTEGER,  -- FOREIGN KEY: References header_id in saleorderhdrs table. Links dispatch to originating sales order header
    sale_order_detail_line_id INTEGER,  -- FOREIGN KEY: References line_id in saleorderdtls table. Links dispatch to specific sales order line item
    item_id INTEGER,
    uom TEXT,
    sale_quantity REAL,
    unit_price REAL,
    schedule_date DATETIME,
    sale_category TEXT,
    frieght_out_ward TEXT,
    packing_cost REAL,
    inventory_org_id INTEGER,
    schedule_quantity REAL,
    tolerance_quantity REAL,
    item_group TEXT,
    oracle_line_id TEXT,
    customer_trx_line_id TEXT,
    trading_manufacture TEXT,
    packing_details TEXT,
    tax_percentage REAL,
    total_value REAL,
    item_segment TEXT,
    pkg_item_id TEXT,
    pkg_item_code TEXT,
    pkg_item_name TEXT,
    pkg_size TEXT,
    pkg_no_of_drum TEXT,
    pkg_price REAL,
    billing_header_id INTEGER,
    duty_other_cost REAL,
    non_claimable_duty REAL,
    discount REAL,
    basic_price REAL,
    transaction_set_id TEXT,
    transaction_id TEXT,
    inventory_org_name TEXT,
    inventory_org_code TEXT,
    oracle_header_id TEXT,
    oracle_status TEXT,
    billing_confimration_comment TEXT,
    created_by INTEGER,
    creation_date DATETIME,
    last_updated_by INTEGER,
    last_update_date DATETIME,
    dtl_requisition_header_id TEXT,
    requisition_line_id TEXT,
    
    CONSTRAINT fk_dispatchdetails_header FOREIGN KEY (header_id) 
        REFERENCES dispatches(header_id),
    CONSTRAINT fk_dispatchdetails_schedule FOREIGN KEY (schedule_line_id) 
        REFERENCES schedules(line_id),
    CONSTRAINT fk_dispatchdetails_saleorder_hdr FOREIGN KEY (sale_order_header_id) 
        REFERENCES saleorderhdrs(header_id),
    CONSTRAINT fk_dispatchdetails_saleorder_dtl FOREIGN KEY (sale_order_detail_line_id) 
        REFERENCES saleorderdtls(line_id)
);

-- COLUMN PRIORITY for dispatchdetails
-- MANDATORY: total_value
-- OPTIONAL (Priority 1): line_id, header_id, sale_quantity
-- OPTIONAL (Priority 2): schedule_line_id, item_id, unit_price
-- OPTIONAL (Priority 3): schedule_date, sale_category, tax_percentage

```
"""

