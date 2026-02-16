// ===============================================================================================
// ENTERPRISE ANALYTICS DASHBOARD - COMPLEX MULTI-PAGE REPORT DATA
// ===============================================================================================
// This data structure represents a real-world enterprise dashboard with multiple sections
// spanning across different pages. Each section contains specific chart types and metrics.
// ===============================================================================================

// ===============================================================================================
// PAGE 1: EXECUTIVE SUMMARY & FINANCIAL OVERVIEW
// ===============================================================================================

export const page1_executiveSummary = {
  pageTitle: "Executive Summary",
  pageNumber: 1,
  sections: [
    {
      sectionId: "exec-kpis",
      sectionTitle: "Key Performance Indicators",
      chartType: "kpi-cards",
      description: "Top-level business metrics at a glance",
      data: {
        kpis: [
          { 
            metric: "Total Revenue", 
            value: 12500000, 
            change: 15.3, 
            target: 12000000,
            format: "currency",
            period: "Q4 2024"
          },
          { 
            metric: "Net Profit", 
            value: 2850000, 
            change: 22.1, 
            target: 2500000,
            format: "currency",
            period: "Q4 2024"
          },
          { 
            metric: "Profit Margin", 
            value: 22.8, 
            change: 5.2, 
            target: 20,
            format: "percent",
            period: "Q4 2024"
          },
          { 
            metric: "Customer Acquisition", 
            value: 8540, 
            change: -3.4, 
            target: 9000,
            format: "number",
            period: "Q4 2024"
          },
          { 
            metric: "Customer Retention", 
            value: 94.5, 
            change: 2.1, 
            target: 95,
            format: "percent",
            period: "Q4 2024"
          },
          { 
            metric: "Market Share", 
            value: 18.4, 
            change: 1.8, 
            target: 20,
            format: "percent",
            period: "Q4 2024"
          }
        ]
      }
    },
    {
      sectionId: "revenue-trend",
      sectionTitle: "12-Month Revenue Trend",
      chartType: "multi-line",
      description: "Monthly revenue, costs, and profit comparison",
      data: {
        timeSeries: [
          { month: "Jan 2024", revenue: 980000, costs: 756000, profit: 224000, forecast: 950000 },
          { month: "Feb 2024", revenue: 920000, costs: 710000, profit: 210000, forecast: 930000 },
          { month: "Mar 2024", revenue: 1050000, costs: 798000, profit: 252000, forecast: 1000000 },
          { month: "Apr 2024", revenue: 1020000, costs: 780000, profit: 240000, forecast: 1020000 },
          { month: "May 2024", revenue: 1150000, costs: 850000, profit: 300000, forecast: 1080000 },
          { month: "Jun 2024", revenue: 1080000, costs: 820000, profit: 260000, forecast: 1100000 },
          { month: "Jul 2024", revenue: 1200000, costs: 900000, profit: 300000, forecast: 1150000 },
          { month: "Aug 2024", revenue: 1180000, costs: 880000, profit: 300000, forecast: 1180000 },
          { month: "Sep 2024", revenue: 1250000, costs: 920000, profit: 330000, forecast: 1200000 },
          { month: "Oct 2024", revenue: 1300000, costs: 960000, profit: 340000, forecast: 1250000 },
          { month: "Nov 2024", revenue: 1350000, costs: 1000000, profit: 350000, forecast: 1300000 },
          { month: "Dec 2024", revenue: 1420000, costs: 1050000, profit: 370000, forecast: 1380000 }
        ]
      }
    },
    {
      sectionId: "quarterly-comparison",
      sectionTitle: "Quarterly Performance Comparison",
      chartType: "grouped-bar",
      description: "Year-over-year quarterly revenue and profit comparison",
      data: {
        quarters: [
          { quarter: "Q1 2023", revenue: 2650000, profit: 580000, expenses: 2070000 },
          { quarter: "Q2 2023", revenue: 2980000, profit: 685000, expenses: 2295000 },
          { quarter: "Q3 2023", revenue: 3250000, profit: 780000, expenses: 2470000 },
          { quarter: "Q4 2023", revenue: 3580000, profit: 895000, expenses: 2685000 },
          { quarter: "Q1 2024", revenue: 2950000, profit: 686000, expenses: 2264000 },
          { quarter: "Q2 2024", revenue: 3250000, profit: 800000, expenses: 2450000 },
          { quarter: "Q3 2024", revenue: 3630000, profit: 930000, expenses: 2700000 },
          { quarter: "Q4 2024", revenue: 4070000, profit: 1060000, expenses: 3010000 }
        ]
      }
    },
    {
      sectionId: "profit-margin-trend",
      sectionTitle: "Profit Margin Evolution",
      chartType: "area",
      description: "Monthly profit margin percentage over 12 months",
      data: {
        margins: [
          { month: "Jan 2024", margin: 22.9, industry_avg: 20.5 },
          { month: "Feb 2024", margin: 22.8, industry_avg: 20.4 },
          { month: "Mar 2024", margin: 24.0, industry_avg: 20.6 },
          { month: "Apr 2024", margin: 23.5, industry_avg: 20.7 },
          { month: "May 2024", margin: 26.1, industry_avg: 20.8 },
          { month: "Jun 2024", margin: 24.1, industry_avg: 20.9 },
          { month: "Jul 2024", margin: 25.0, industry_avg: 21.0 },
          { month: "Aug 2024", margin: 25.4, industry_avg: 21.1 },
          { month: "Sep 2024", margin: 26.4, industry_avg: 21.2 },
          { month: "Oct 2024", margin: 26.2, industry_avg: 21.3 },
          { month: "Nov 2024", margin: 25.9, industry_avg: 21.4 },
          { month: "Dec 2024", margin: 26.1, industry_avg: 21.5 }
        ]
      }
    }
  ]
};

// ===============================================================================================
// PAGE 2: SALES PERFORMANCE & CUSTOMER ANALYTICS
// ===============================================================================================

export const page2_salesPerformance = {
  pageTitle: "Sales Performance & Customer Analytics",
  pageNumber: 2,
  sections: [
    {
      sectionId: "sales-by-region",
      sectionTitle: "Regional Sales Distribution",
      chartType: "donut",
      description: "Revenue contribution by geographic region",
      data: {
        regions: [
          { region: "North America", revenue: 4850000, percentage: 38.8, growth: 12.5 },
          { region: "Europe", revenue: 3420000, percentage: 27.4, growth: 8.3 },
          { region: "Asia Pacific", revenue: 2680000, percentage: 21.4, growth: 18.7 },
          { region: "Latin America", revenue: 980000, percentage: 7.8, growth: 5.2 },
          { region: "Middle East & Africa", revenue: 570000, percentage: 4.6, growth: 15.9 }
        ]
      }
    },
    {
      sectionId: "sales-rep-performance",
      sectionTitle: "Sales Representative Performance",
      chartType: "horizontal-bar",
      description: "Individual sales rep quota attainment and revenue",
      data: {
        salesReps: [
          { name: "Sarah Johnson", revenue: 1250000, quota: 1200000, deals: 45, region: "North America" },
          { name: "Michael Chen", revenue: 1180000, quota: 1200000, deals: 42, region: "Asia Pacific" },
          { name: "Emma Williams", revenue: 1150000, quota: 1100000, deals: 38, region: "Europe" },
          { name: "James Rodriguez", revenue: 980000, quota: 1000000, deals: 35, region: "Latin America" },
          { name: "Aisha Patel", revenue: 920000, quota: 900000, deals: 32, region: "Middle East & Africa" },
          { name: "David Kim", revenue: 880000, quota: 1000000, deals: 28, region: "Asia Pacific" },
          { name: "Lisa Anderson", revenue: 850000, quota: 900000, deals: 30, region: "North America" },
          { name: "Carlos Martinez", revenue: 780000, quota: 800000, deals: 25, region: "Europe" }
        ]
      }
    },
    {
      sectionId: "customer-segments",
      sectionTitle: "Customer Segmentation Analysis",
      chartType: "stacked-bar",
      description: "Revenue breakdown by customer segment and size",
      data: {
        segments: [
          { 
            month: "Jan", 
            enterprise: 450000, 
            midMarket: 320000, 
            smallBusiness: 210000 
          },
          { 
            month: "Feb", 
            enterprise: 420000, 
            midMarket: 310000, 
            smallBusiness: 190000 
          },
          { 
            month: "Mar", 
            enterprise: 480000, 
            midMarket: 350000, 
            smallBusiness: 220000 
          },
          { 
            month: "Apr", 
            enterprise: 470000, 
            midMarket: 340000, 
            smallBusiness: 210000 
          },
          { 
            month: "May", 
            enterprise: 520000, 
            midMarket: 380000, 
            smallBusiness: 250000 
          },
          { 
            month: "Jun", 
            enterprise: 490000, 
            midMarket: 360000, 
            smallBusiness: 230000 
          },
          { 
            month: "Jul", 
            enterprise: 550000, 
            midMarket: 400000, 
            smallBusiness: 250000 
          },
          { 
            month: "Aug", 
            enterprise: 540000, 
            midMarket: 390000, 
            smallBusiness: 250000 
          },
          { 
            month: "Sep", 
            enterprise: 580000, 
            midMarket: 420000, 
            smallBusiness: 250000 
          },
          { 
            month: "Oct", 
            enterprise: 600000, 
            midMarket: 440000, 
            smallBusiness: 260000 
          },
          { 
            month: "Nov", 
            enterprise: 620000, 
            midMarket: 460000, 
            smallBusiness: 270000 
          },
          { 
            month: "Dec", 
            enterprise: 650000, 
            midMarket: 480000, 
            smallBusiness: 290000 
          }
        ]
      }
    },
    {
      sectionId: "customer-acquisition-cost",
      sectionTitle: "Customer Acquisition Metrics",
      chartType: "multi-line",
      description: "CAC, LTV, and conversion rates over time",
      data: {
        acquisitionMetrics: [
          { month: "Jan", cac: 850, ltv: 4200, conversionRate: 3.2, leads: 2800 },
          { month: "Feb", cac: 820, ltv: 4300, conversionRate: 3.5, leads: 2600 },
          { month: "Mar", cac: 880, ltv: 4500, conversionRate: 3.8, leads: 3100 },
          { month: "Apr", cac: 860, ltv: 4400, conversionRate: 3.6, leads: 2900 },
          { month: "May", cac: 900, ltv: 4600, conversionRate: 4.0, leads: 3300 },
          { month: "Jun", cac: 870, ltv: 4550, conversionRate: 3.7, leads: 3000 },
          { month: "Jul", cac: 920, ltv: 4700, conversionRate: 4.2, leads: 3400 },
          { month: "Aug", cac: 910, ltv: 4650, conversionRate: 4.1, leads: 3200 },
          { month: "Sep", cac: 950, ltv: 4800, conversionRate: 4.3, leads: 3500 },
          { month: "Oct", cac: 930, ltv: 4750, conversionRate: 4.2, leads: 3400 },
          { month: "Nov", cac: 970, ltv: 4900, conversionRate: 4.5, leads: 3600 },
          { month: "Dec", cac: 990, ltv: 5000, conversionRate: 4.6, leads: 3800 }
        ]
      }
    },
    {
      sectionId: "sales-funnel",
      sectionTitle: "Sales Funnel Conversion",
      chartType: "funnel",
      description: "Lead to customer conversion stages",
      data: {
        funnelStages: [
          { stage: "Total Leads", count: 38500, percentage: 100, dropOff: 0 },
          { stage: "Qualified Leads", count: 19250, percentage: 50, dropOff: 50 },
          { stage: "Opportunities", count: 11550, percentage: 30, dropOff: 40 },
          { stage: "Proposals Sent", count: 5775, percentage: 15, dropOff: 50 },
          { stage: "Negotiations", count: 3850, percentage: 10, dropOff: 33 },
          { stage: "Closed Won", count: 1540, percentage: 4, dropOff: 60 }
        ]
      }
    }
  ]
};

// ===============================================================================================
// PAGE 3: PRODUCT PERFORMANCE & INVENTORY
// ===============================================================================================

export const page3_productPerformance = {
  pageTitle: "Product Performance & Inventory Management",
  pageNumber: 3,
  sections: [
    {
      sectionId: "product-revenue-mix",
      sectionTitle: "Product Revenue Mix",
      chartType: "treemap",
      description: "Revenue contribution by product category and SKU",
      data: {
        products: [
          { 
            category: "Electronics", 
            subcategory: "Smartphones", 
            sku: "PHONE-PRO-X1", 
            revenue: 2850000,
            units: 12500,
            margin: 28.5
          },
          { 
            category: "Electronics", 
            subcategory: "Laptops", 
            sku: "LAPTOP-ULT-15", 
            revenue: 2450000,
            units: 8200,
            margin: 32.1
          },
          { 
            category: "Electronics", 
            subcategory: "Tablets", 
            sku: "TAB-PRO-11", 
            revenue: 1680000,
            units: 15600,
            margin: 25.8
          },
          { 
            category: "Appliances", 
            subcategory: "Refrigerators", 
            sku: "FRIDGE-SM-450", 
            revenue: 1450000,
            units: 3800,
            margin: 22.3
          },
          { 
            category: "Appliances", 
            subcategory: "Washing Machines", 
            sku: "WASH-FL-8KG", 
            revenue: 1280000,
            units: 4200,
            margin: 20.5
          },
          { 
            category: "Clothing", 
            subcategory: "Premium Wear", 
            sku: "CLOTH-PRM-001", 
            revenue: 980000,
            units: 22400,
            margin: 45.2
          },
          { 
            category: "Clothing", 
            subcategory: "Casual Wear", 
            sku: "CLOTH-CAS-002", 
            revenue: 850000,
            units: 28900,
            margin: 42.8
          },
          { 
            category: "Home & Kitchen", 
            subcategory: "Cookware", 
            sku: "COOK-SET-PRO", 
            revenue: 680000,
            units: 8500,
            margin: 38.5
          },
          { 
            category: "Home & Kitchen", 
            subcategory: "Storage", 
            sku: "STOR-ORG-100", 
            revenue: 420000,
            units: 15200,
            margin: 35.7
          },
          { 
            category: "Sports", 
            subcategory: "Fitness Equipment", 
            sku: "FIT-HOME-GYM", 
            revenue: 560000,
            units: 1800,
            margin: 28.9
          }
        ]
      }
    },
    {
      sectionId: "product-growth",
      sectionTitle: "Product Category Growth Rate",
      chartType: "scatter",
      description: "Revenue vs growth rate by product category",
      data: {
        categoryGrowth: [
          { category: "Smartphones", revenue: 2850000, growthRate: 18.5, marketShare: 22.8 },
          { category: "Laptops", revenue: 2450000, growthRate: 12.3, marketShare: 19.6 },
          { category: "Tablets", revenue: 1680000, growthRate: 8.7, marketShare: 13.4 },
          { category: "Refrigerators", revenue: 1450000, growthRate: 5.2, marketShare: 11.6 },
          { category: "Washing Machines", revenue: 1280000, growthRate: 6.8, marketShare: 10.2 },
          { category: "Premium Wear", revenue: 980000, growthRate: 15.4, marketShare: 7.8 },
          { category: "Casual Wear", revenue: 850000, growthRate: 10.2, marketShare: 6.8 },
          { category: "Cookware", revenue: 680000, growthRate: 4.5, marketShare: 5.4 },
          { category: "Fitness Equipment", revenue: 560000, growthRate: 22.1, marketShare: 4.5 },
          { category: "Storage", revenue: 420000, growthRate: 3.2, marketShare: 3.4 }
        ]
      }
    },
    {
      sectionId: "inventory-turnover",
      sectionTitle: "Inventory Turnover Rate",
      chartType: "line",
      description: "Monthly inventory turnover by category",
      data: {
        turnoverData: [
          { month: "Jan", electronics: 6.2, appliances: 4.5, clothing: 8.3, homeKitchen: 5.8 },
          { month: "Feb", electronics: 6.0, appliances: 4.3, clothing: 8.1, homeKitchen: 5.6 },
          { month: "Mar", electronics: 6.5, appliances: 4.8, clothing: 8.7, homeKitchen: 6.2 },
          { month: "Apr", electronics: 6.3, appliances: 4.6, clothing: 8.5, homeKitchen: 6.0 },
          { month: "May", electronics: 6.8, appliances: 5.0, clothing: 9.2, homeKitchen: 6.5 },
          { month: "Jun", electronics: 6.6, appliances: 4.9, clothing: 8.9, homeKitchen: 6.3 },
          { month: "Jul", electronics: 7.0, appliances: 5.2, clothing: 9.5, homeKitchen: 6.7 },
          { month: "Aug", electronics: 6.9, appliances: 5.1, clothing: 9.3, homeKitchen: 6.6 },
          { month: "Sep", electronics: 7.2, appliances: 5.4, clothing: 9.8, homeKitchen: 7.0 },
          { month: "Oct", electronics: 7.1, appliances: 5.3, clothing: 9.6, homeKitchen: 6.9 },
          { month: "Nov", electronics: 7.5, appliances: 5.6, clothing: 10.2, homeKitchen: 7.3 },
          { month: "Dec", electronics: 7.8, appliances: 5.9, clothing: 10.5, homeKitchen: 7.6 }
        ]
      }
    },
    {
      sectionId: "stock-levels",
      sectionTitle: "Current Stock Levels by Category",
      chartType: "stacked-area",
      description: "Inventory levels over the past 6 months",
      data: {
        stockLevels: [
          { month: "Jul", electronics: 45000, appliances: 28000, clothing: 52000, homeKitchen: 35000 },
          { month: "Aug", electronics: 47000, appliances: 29000, clothing: 54000, homeKitchen: 36000 },
          { month: "Sep", electronics: 48500, appliances: 30000, clothing: 56000, homeKitchen: 37500 },
          { month: "Oct", electronics: 50000, appliances: 31000, clothing: 58000, homeKitchen: 38500 },
          { month: "Nov", electronics: 52000, appliances: 32500, clothing: 60000, homeKitchen: 40000 },
          { month: "Dec", electronics: 48000, appliances: 30000, clothing: 55000, homeKitchen: 37000 }
        ]
      }
    },
    {
      sectionId: "product-performance-table",
      sectionTitle: "Detailed Product Performance",
      chartType: "table",
      description: "Comprehensive product metrics and KPIs",
      data: {
        productMetrics: [
          {
            sku: "PHONE-PRO-X1",
            productName: "Smartphone Pro X1",
            category: "Electronics",
            revenue: 2850000,
            units: 12500,
            avgPrice: 228,
            margin: 28.5,
            returns: 2.1,
            rating: 4.7,
            stockStatus: "Healthy"
          },
          {
            sku: "LAPTOP-ULT-15",
            productName: "Laptop Ultra 15\"",
            category: "Electronics",
            revenue: 2450000,
            units: 8200,
            avgPrice: 299,
            margin: 32.1,
            returns: 1.8,
            rating: 4.8,
            stockStatus: "Healthy"
          },
          {
            sku: "TAB-PRO-11",
            productName: "Tablet Pro 11\"",
            category: "Electronics",
            revenue: 1680000,
            units: 15600,
            avgPrice: 108,
            margin: 25.8,
            returns: 2.4,
            rating: 4.6,
            stockStatus: "Low"
          },
          {
            sku: "FRIDGE-SM-450",
            productName: "Smart Fridge 450L",
            category: "Appliances",
            revenue: 1450000,
            units: 3800,
            avgPrice: 382,
            margin: 22.3,
            returns: 1.2,
            rating: 4.5,
            stockStatus: "Healthy"
          },
          {
            sku: "WASH-FL-8KG",
            productName: "Front Load Washer 8kg",
            category: "Appliances",
            revenue: 1280000,
            units: 4200,
            avgPrice: 305,
            margin: 20.5,
            returns: 1.5,
            rating: 4.4,
            stockStatus: "Overstocked"
          },
          {
            sku: "CLOTH-PRM-001",
            productName: "Premium Clothing Line",
            category: "Clothing",
            revenue: 980000,
            units: 22400,
            avgPrice: 44,
            margin: 45.2,
            returns: 5.8,
            rating: 4.3,
            stockStatus: "Healthy"
          },
          {
            sku: "CLOTH-CAS-002",
            productName: "Casual Wear Collection",
            category: "Clothing",
            revenue: 850000,
            units: 28900,
            avgPrice: 29,
            margin: 42.8,
            returns: 6.2,
            rating: 4.2,
            stockStatus: "Low"
          },
          {
            sku: "COOK-SET-PRO",
            productName: "Professional Cookware Set",
            category: "Home & Kitchen",
            revenue: 680000,
            units: 8500,
            avgPrice: 80,
            margin: 38.5,
            returns: 3.1,
            rating: 4.6,
            stockStatus: "Healthy"
          },
          {
            sku: "FIT-HOME-GYM",
            productName: "Home Gym Equipment",
            category: "Sports",
            revenue: 560000,
            units: 1800,
            avgPrice: 311,
            margin: 28.9,
            returns: 2.8,
            rating: 4.5,
            stockStatus: "Low"
          },
          {
            sku: "STOR-ORG-100",
            productName: "Storage Organization 100pc",
            category: "Home & Kitchen",
            revenue: 420000,
            units: 15200,
            avgPrice: 28,
            margin: 35.7,
            returns: 4.5,
            rating: 4.1,
            stockStatus: "Healthy"
          }
        ]
      }
    }
  ]
};

// ===============================================================================================
// PAGE 4: MARKETING & CAMPAIGN PERFORMANCE
// ===============================================================================================

export const page4_marketingPerformance = {
  pageTitle: "Marketing & Campaign Performance",
  pageNumber: 4,
  sections: [
    {
      sectionId: "channel-performance",
      sectionTitle: "Marketing Channel ROI",
      chartType: "grouped-bar",
      description: "Spend vs Revenue by marketing channel",
      data: {
        channels: [
          { channel: "Google Ads", spend: 180000, revenue: 1850000, leads: 4200, conversions: 580 },
          { channel: "Facebook Ads", spend: 145000, revenue: 1320000, leads: 3800, conversions: 480 },
          { channel: "LinkedIn Ads", spend: 95000, revenue: 980000, leads: 1200, conversions: 180 },
          { channel: "Email Marketing", spend: 35000, revenue: 750000, leads: 2800, conversions: 420 },
          { channel: "Content Marketing", spend: 65000, revenue: 520000, leads: 1500, conversions: 220 },
          { channel: "Influencer Marketing", spend: 120000, revenue: 680000, leads: 2200, conversions: 180 },
          { channel: "SEO/Organic", spend: 45000, revenue: 890000, leads: 3200, conversions: 380 },
          { channel: "Affiliate Marketing", spend: 55000, revenue: 420000, leads: 1800, conversions: 150 }
        ]
      }
    },
    {
      sectionId: "campaign-effectiveness",
      sectionTitle: "Campaign Performance Over Time",
      chartType: "multi-line",
      description: "Monthly campaign metrics: impressions, clicks, conversions",
      data: {
        campaignMetrics: [
          { month: "Jan", impressions: 8500000, clicks: 425000, conversions: 12750, ctr: 5.0, cpc: 0.42 },
          { month: "Feb", impressions: 8200000, clicks: 410000, conversions: 12300, ctr: 5.0, cpc: 0.41 },
          { month: "Mar", impressions: 9100000, clicks: 473000, conversions: 14190, ctr: 5.2, cpc: 0.40 },
          { month: "Apr", impressions: 8800000, clicks: 458000, conversions: 13740, ctr: 5.2, cpc: 0.41 },
          { month: "May", impressions: 9500000, clicks: 522500, conversions: 15675, ctr: 5.5, cpc: 0.39 },
          { month: "Jun", impressions: 9200000, clicks: 506000, conversions: 15180, ctr: 5.5, cpc: 0.39 },
          { month: "Jul", impressions: 9800000, clicks: 568400, conversions: 17052, ctr: 5.8, cpc: 0.38 },
          { month: "Aug", impressions: 9600000, clicks: 556800, conversions: 16704, ctr: 5.8, cpc: 0.38 },
          { month: "Sep", impressions: 10200000, clicks: 622200, conversions: 18666, ctr: 6.1, cpc: 0.37 },
          { month: "Oct", impressions: 10000000, clicks: 610000, conversions: 18300, ctr: 6.1, cpc: 0.37 },
          { month: "Nov", impressions: 10500000, clicks: 672000, conversions: 20160, ctr: 6.4, cpc: 0.36 },
          { month: "Dec", impressions: 11000000, clicks: 726000, conversions: 21780, ctr: 6.6, cpc: 0.35 }
        ]
      }
    },
    {
      sectionId: "customer-journey",
      sectionTitle: "Customer Journey Touchpoints",
      chartType: "sankey",
      description: "Multi-touch attribution across channels",
      data: {
        journeyFlow: [
          { source: "Organic Search", target: "Landing Page", value: 15200 },
          { source: "Paid Search", target: "Landing Page", value: 12800 },
          { source: "Social Media", target: "Landing Page", value: 9500 },
          { source: "Email", target: "Landing Page", value: 6800 },
          { source: "Direct", target: "Landing Page", value: 5200 },
          { source: "Landing Page", target: "Product Page", value: 35400 },
          { source: "Landing Page", target: "Blog", value: 8900 },
          { source: "Landing Page", target: "Exit", value: 5200 },
          { source: "Product Page", target: "Cart", value: 18200 },
          { source: "Product Page", target: "Exit", value: 17200 },
          { source: "Blog", target: "Product Page", value: 5400 },
          { source: "Blog", target: "Exit", value: 3500 },
          { source: "Cart", target: "Checkout", value: 12800 },
          { source: "Cart", target: "Exit", value: 5400 },
          { source: "Checkout", target: "Purchase", value: 8540 },
          { source: "Checkout", target: "Exit", value: 4260 }
        ]
      }
    },
    {
      sectionId: "social-media-engagement",
      sectionTitle: "Social Media Engagement Metrics",
      chartType: "area",
      description: "Follower growth and engagement rates",
      data: {
        socialMetrics: [
          { month: "Jan", followers: 285000, engagement: 4.2, reach: 1850000, posts: 45 },
          { month: "Feb", followers: 298000, engagement: 4.4, reach: 1920000, posts: 42 },
          { month: "Mar", followers: 315000, engagement: 4.6, reach: 2100000, posts: 48 },
          { month: "Apr", followers: 328000, engagement: 4.5, reach: 2050000, posts: 46 },
          { month: "May", followers: 345000, engagement: 4.8, reach: 2280000, posts: 52 },
          { month: "Jun", followers: 360000, engagement: 4.7, reach: 2200000, posts: 50 },
          { month: "Jul", followers: 378000, engagement: 5.0, reach: 2450000, posts: 55 },
          { month: "Aug", followers: 392000, engagement: 4.9, reach: 2380000, posts: 53 },
          { month: "Sep", followers: 410000, engagement: 5.2, reach: 2680000, posts: 58 },
          { month: "Oct", followers: 425000, engagement: 5.1, reach: 2600000, posts: 56 },
          { month: "Nov", followers: 445000, engagement: 5.4, reach: 2850000, posts: 60 },
          { month: "Dec", followers: 468000, engagement: 5.6, reach: 3100000, posts: 65 }
        ]
      }
    },
    {
      sectionId: "content-performance",
      sectionTitle: "Top Performing Content",
      chartType: "table",
      description: "Content pieces ranked by engagement and conversions",
      data: {
        contentPieces: [
          {
            title: "Ultimate Guide to Smart Home Setup",
            type: "Blog Post",
            views: 145000,
            engagement: 8.2,
            shares: 4500,
            conversions: 580,
            revenue: 185000,
            publishDate: "2024-11-15"
          },
          {
            title: "Black Friday Electronics Deals",
            type: "Landing Page",
            views: 285000,
            engagement: 12.5,
            shares: 8900,
            conversions: 1250,
            revenue: 420000,
            publishDate: "2024-11-20"
          },
          {
            title: "How to Choose the Perfect Laptop",
            type: "Video",
            views: 98000,
            engagement: 15.8,
            shares: 3200,
            conversions: 380,
            revenue: 125000,
            publishDate: "2024-10-05"
          },
          {
            title: "Fitness at Home: Complete Equipment Guide",
            type: "Blog Post",
            views: 68000,
            engagement: 9.5,
            shares: 2100,
            conversions: 220,
            revenue: 68000,
            publishDate: "2024-09-12"
          },
          {
            title: "Premium Clothing Collection Launch",
            type: "Email Campaign",
            views: 52000,
            engagement: 18.2,
            shares: 1800,
            conversions: 680,
            revenue: 95000,
            publishDate: "2024-11-01"
          }
        ]
      }
    }
  ]
};

// ===============================================================================================
// PAGE 5: CUSTOMER INSIGHTS & SATISFACTION
// ===============================================================================================

export const page5_customerInsights = {
  pageTitle: "Customer Insights & Satisfaction",
  pageNumber: 5,
  sections: [
    {
      sectionId: "customer-demographics",
      sectionTitle: "Customer Demographics Distribution",
      chartType: "pie",
      description: "Customer base breakdown by age, income, and location",
      data: {
        ageDistribution: [
          { ageGroup: "18-24", count: 12500, percentage: 14.6, avgSpend: 285 },
          { ageGroup: "25-34", count: 28500, percentage: 33.4, avgSpend: 520 },
          { ageGroup: "35-44", count: 24000, percentage: 28.1, avgSpend: 680 },
          { ageGroup: "45-54", count: 13500, percentage: 15.8, avgSpend: 780 },
          { ageGroup: "55-64", count: 5200, percentage: 6.1, avgSpend: 850 },
          { ageGroup: "65+", count: 1800, percentage: 2.1, avgSpend: 920 }
        ],
        incomeDistribution: [
          { bracket: "Under $30k", count: 8500, percentage: 9.9, avgSpend: 180 },
          { bracket: "$30k-$50k", count: 18200, percentage: 21.3, avgSpend: 320 },
          { bracket: "$50k-$75k", count: 25600, percentage: 29.9, avgSpend: 485 },
          { bracket: "$75k-$100k", count: 19800, percentage: 23.2, avgSpend: 725 },
          { bracket: "$100k-$150k", count: 10200, percentage: 11.9, avgSpend: 1050 },
          { bracket: "Above $150k", count: 3200, percentage: 3.7, avgSpend: 1850 }
        ]
      }
    },
    {
      sectionId: "customer-satisfaction",
      sectionTitle: "Customer Satisfaction Scores (CSAT & NPS)",
      chartType: "line",
      description: "Monthly satisfaction and Net Promoter Score trends",
      data: {
        satisfactionTrend: [
          { month: "Jan", csat: 82, nps: 45, ces: 6.8 },
          { month: "Feb", csat: 83, nps: 46, ces: 6.7 },
          { month: "Mar", csat: 85, nps: 48, ces: 6.5 },
          { month: "Apr", csat: 84, nps: 47, ces: 6.6 },
          { month: "May", csat: 86, nps: 50, ces: 6.4 },
          { month: "Jun", csat: 87, nps: 51, ces: 6.3 },
          { month: "Jul", csat: 88, nps: 53, ces: 6.2 },
          { month: "Aug", csat: 87, nps: 52, ces: 6.3 },
          { month: "Sep", csat: 89, nps: 55, ces: 6.0 },
          { month: "Oct", csat: 90, nps: 56, ces: 5.9 },
          { month: "Nov", csat: 91, nps: 58, ces: 5.8 },
          { month: "Dec", csat: 92, nps: 60, ces: 5.6 }
        ]
      }
    },
    {
      sectionId: "support-tickets",
      sectionTitle: "Customer Support Ticket Analysis",
      chartType: "stacked-bar",
      description: "Support tickets by category and resolution status",
      data: {
        ticketsByCategory: [
          { month: "Jan", technical: 850, billing: 420, shipping: 680, product: 520, other: 280 },
          { month: "Feb", technical: 820, billing: 390, shipping: 650, product: 510, other: 260 },
          { month: "Mar", technical: 920, billing: 450, shipping: 720, product: 580, other: 310 },
          { month: "Apr", technical: 880, billing: 430, shipping: 690, product: 560, other: 290 },
          { month: "May", technical: 980, billing: 480, shipping: 780, product: 640, other: 340 },
          { month: "Jun", technical: 950, billing: 460, shipping: 750, product: 620, other: 320 },
          { month: "Jul", technical: 1020, billing: 510, shipping: 820, product: 680, other: 360 },
          { month: "Aug", technical: 990, billing: 490, shipping: 790, product: 660, other: 350 },
          { month: "Sep", technical: 1080, billing: 540, shipping: 860, product: 720, other: 380 },
          { month: "Oct", technical: 1050, billing: 520, shipping: 830, product: 700, other: 370 },
          { month: "Nov", technical: 1150, billing: 580, shipping: 920, product: 780, other: 420 },
          { month: "Dec", technical: 1200, billing: 620, shipping: 980, product: 840, other: 460 }
        ],
        resolutionMetrics: [
          { month: "Jan", avgResolutionTime: 18.5, firstCallResolution: 68.2, escalationRate: 12.5 },
          { month: "Feb", avgResolutionTime: 17.8, firstCallResolution: 69.5, escalationRate: 11.8 },
          { month: "Mar", avgResolutionTime: 16.5, firstCallResolution: 71.2, escalationRate: 10.5 },
          { month: "Apr", avgResolutionTime: 16.8, firstCallResolution: 70.8, escalationRate: 10.8 },
          { month: "May", avgResolutionTime: 15.2, firstCallResolution: 73.5, escalationRate: 9.2 },
          { month: "Jun", avgResolutionTime: 15.5, firstCallResolution: 72.8, escalationRate: 9.5 },
          { month: "Jul", avgResolutionTime: 14.2, firstCallResolution: 75.8, escalationRate: 8.0 },
          { month: "Aug", avgResolutionTime: 14.5, firstCallResolution: 75.2, escalationRate: 8.2 },
          { month: "Sep", avgResolutionTime: 13.5, firstCallResolution: 77.5, escalationRate: 7.2 },
          { month: "Oct", avgResolutionTime: 13.8, firstCallResolution: 76.8, escalationRate: 7.5 },
          { month: "Nov", avgResolutionTime: 12.8, firstCallResolution: 79.2, escalationRate: 6.5 },
          { month: "Dec", avgResolutionTime: 12.2, firstCallResolution: 80.5, escalationRate: 6.0 }
        ]
      }
    },
    {
      sectionId: "customer-lifetime-value",
      sectionTitle: "Customer Lifetime Value Segments",
      chartType: "scatter",
      description: "Customer segments by LTV and purchase frequency",
      data: {
        clvSegments: [
          { segment: "Champions", ltv: 8500, frequency: 24, recency: 15, count: 4200 },
          { segment: "Loyal Customers", ltv: 5200, frequency: 18, recency: 30, count: 8500 },
          { segment: "Potential Loyalists", ltv: 3800, frequency: 12, recency: 45, count: 12800 },
          { segment: "Recent Customers", ltv: 2100, frequency: 3, recency: 20, count: 15600 },
          { segment: "Promising", ltv: 2800, frequency: 6, recency: 35, count: 9200 },
          { segment: "Need Attention", ltv: 4200, frequency: 15, recency: 90, count: 6800 },
          { segment: "About to Sleep", ltv: 3500, frequency: 10, recency: 120, count: 8900 },
          { segment: "At Risk", ltv: 4800, frequency: 16, recency: 150, count: 5200 },
          { segment: "Cannot Lose", ltv: 7200, frequency: 20, recency: 180, count: 3200 },
          { segment: "Hibernating", ltv: 2600, frequency: 8, recency: 240, count: 11500 }
        ]
      }
    },
    {
      sectionId: "churn-analysis",
      sectionTitle: "Customer Churn Rate Analysis",
      chartType: "multi-area",
      description: "Churn rate by segment and retention efforts",
      data: {
        churnData: [
          { month: "Jan", overall: 5.8, enterprise: 2.1, midMarket: 4.5, smallBusiness: 8.9 },
          { month: "Feb", overall: 5.6, enterprise: 2.0, midMarket: 4.3, smallBusiness: 8.5 },
          { month: "Mar", overall: 5.2, enterprise: 1.8, midMarket: 4.0, smallBusiness: 8.0 },
          { month: "Apr", overall: 5.4, enterprise: 1.9, midMarket: 4.2, smallBusiness: 8.3 },
          { month: "May", overall: 4.8, enterprise: 1.6, midMarket: 3.7, smallBusiness: 7.5 },
          { month: "Jun", overall: 5.0, enterprise: 1.7, midMarket: 3.9, smallBusiness: 7.8 },
          { month: "Jul", overall: 4.5, enterprise: 1.4, midMarket: 3.5, smallBusiness: 7.0 },
          { month: "Aug", overall: 4.7, enterprise: 1.5, midMarket: 3.6, smallBusiness: 7.3 },
          { month: "Sep", overall: 4.2, enterprise: 1.2, midMarket: 3.2, smallBusiness: 6.5 },
          { month: "Oct", overall: 4.4, enterprise: 1.3, midMarket: 3.4, smallBusiness: 6.8 },
          { month: "Nov", overall: 4.0, enterprise: 1.1, midMarket: 3.0, smallBusiness: 6.2 },
          { month: "Dec", overall: 3.8, enterprise: 1.0, midMarket: 2.8, smallBusiness: 5.9 }
        ]
      }
    }
  ]
};

// ===============================================================================================
// PAGE 6: OPERATIONAL EFFICIENCY & SUPPLY CHAIN
// ===============================================================================================

export const page6_operationalMetrics = {
  pageTitle: "Operational Efficiency & Supply Chain",
  pageNumber: 6,
  sections: [
    {
      sectionId: "order-fulfillment",
      sectionTitle: "Order Fulfillment Metrics",
      chartType: "multi-line",
      description: "Processing time, shipping time, and delivery accuracy",
      data: {
        fulfillmentMetrics: [
          { month: "Jan", processingTime: 1.8, shippingTime: 3.2, onTimeDelivery: 92.5, orderAccuracy: 96.8 },
          { month: "Feb", processingTime: 1.7, shippingTime: 3.1, onTimeDelivery: 93.2, orderAccuracy: 97.0 },
          { month: "Mar", processingTime: 1.5, shippingTime: 2.9, onTimeDelivery: 94.5, orderAccuracy: 97.5 },
          { month: "Apr", processingTime: 1.6, shippingTime: 3.0, onTimeDelivery: 93.8, orderAccuracy: 97.2 },
          { month: "May", processingTime: 1.4, shippingTime: 2.7, onTimeDelivery: 95.2, orderAccuracy: 98.0 },
          { month: "Jun", processingTime: 1.5, shippingTime: 2.8, onTimeDelivery: 94.8, orderAccuracy: 97.8 },
          { month: "Jul", processingTime: 1.3, shippingTime: 2.5, onTimeDelivery: 96.0, orderAccuracy: 98.5 },
          { month: "Aug", processingTime: 1.4, shippingTime: 2.6, onTimeDelivery: 95.5, orderAccuracy: 98.2 },
          { month: "Sep", processingTime: 1.2, shippingTime: 2.4, onTimeDelivery: 96.8, orderAccuracy: 98.8 },
          { month: "Oct", processingTime: 1.3, shippingTime: 2.5, onTimeDelivery: 96.2, orderAccuracy: 98.6 },
          { month: "Nov", processingTime: 1.1, shippingTime: 2.2, onTimeDelivery: 97.5, orderAccuracy: 99.0 },
          { month: "Dec", processingTime: 1.0, shippingTime: 2.1, onTimeDelivery: 98.0, orderAccuracy: 99.2 }
        ]
      }
    },
    {
      sectionId: "warehouse-efficiency",
      sectionTitle: "Warehouse Performance Metrics",
      chartType: "grouped-bar",
      description: "Utilization, accuracy, and throughput by warehouse",
      data: {
        warehousePerformance: [
          { 
            warehouse: "East Coast DC", 
            utilization: 87.5, 
            pickAccuracy: 98.5, 
            throughput: 15200,
            costPerUnit: 2.85,
            region: "Northeast"
          },
          { 
            warehouse: "West Coast DC", 
            utilization: 92.3, 
            pickAccuracy: 97.8, 
            throughput: 18500,
            costPerUnit: 3.12,
            region: "Pacific"
          },
          { 
            warehouse: "Midwest DC", 
            utilization: 82.8, 
            pickAccuracy: 98.2, 
            throughput: 12800,
            costPerUnit: 2.65,
            region: "Central"
          },
          { 
            warehouse: "Southern DC", 
            utilization: 88.9, 
            pickAccuracy: 97.5, 
            throughput: 14600,
            costPerUnit: 2.78,
            region: "South"
          },
          { 
            warehouse: "Canada DC", 
            utilization: 79.5, 
            pickAccuracy: 96.8, 
            throughput: 9200,
            costPerUnit: 3.45,
            region: "International"
          }
        ]
      }
    },
    {
      sectionId: "supplier-performance",
      sectionTitle: "Supplier Performance Scorecard",
      chartType: "scatter",
      description: "On-time delivery vs quality score by supplier",
      data: {
        supplierMetrics: [
          { supplier: "TechSource Inc", onTimeRate: 96.5, qualityScore: 94.2, volume: 2850000, defectRate: 1.2 },
          { supplier: "GlobalParts Ltd", onTimeRate: 92.8, qualityScore: 96.8, volume: 1980000, defectRate: 0.8 },
          { supplier: "AsiaManufacturing Co", onTimeRate: 88.5, qualityScore: 91.5, volume: 3250000, defectRate: 2.1 },
          { supplier: "EuroComponents GmbH", onTimeRate: 94.2, qualityScore: 97.5, volume: 1650000, defectRate: 0.6 },
          { supplier: "LocalSupply Partners", onTimeRate: 98.5, qualityScore: 93.8, volume: 980000, defectRate: 1.5 },
          { supplier: "Pacific Wholesale", onTimeRate: 90.5, qualityScore: 95.2, volume: 1420000, defectRate: 1.0 },
          { supplier: "Premium Materials Inc", onTimeRate: 95.8, qualityScore: 98.2, volume: 1180000, defectRate: 0.4 },
          { supplier: "Budget Components Ltd", onTimeRate: 85.2, qualityScore: 88.5, volume: 2100000, defectRate: 3.2 }
        ]
      }
    },
    {
      sectionId: "logistics-costs",
      sectionTitle: "Logistics Cost Breakdown",
      chartType: "stacked-area",
      description: "Transportation, warehousing, and handling costs over time",
      data: {
        logisticsCosts: [
          { month: "Jan", transportation: 185000, warehousing: 95000, handling: 42000, packaging: 28000 },
          { month: "Feb", transportation: 178000, warehousing: 92000, handling: 40000, packaging: 27000 },
          { month: "Mar", transportation: 195000, warehousing: 98000, handling: 45000, packaging: 30000 },
          { month: "Apr", transportation: 188000, warehousing: 96000, handling: 43000, packaging: 29000 },
          { month: "May", transportation: 205000, warehousing: 102000, handling: 48000, packaging: 32000 },
          { month: "Jun", transportation: 198000, warehousing: 100000, handling: 46000, packaging: 31000 },
          { month: "Jul", transportation: 215000, warehousing: 108000, handling: 51000, packaging: 34000 },
          { month: "Aug", transportation: 208000, warehousing: 105000, handling: 49000, packaging: 33000 },
          { month: "Sep", transportation: 225000, warehousing: 112000, handling: 53000, packaging: 36000 },
          { month: "Oct", transportation: 218000, warehousing: 110000, handling: 52000, packaging: 35000 },
          { month: "Nov", transportation: 235000, warehousing: 118000, handling: 56000, packaging: 38000 },
          { month: "Dec", transportation: 248000, warehousing: 125000, handling: 60000, packaging: 40000 }
        ]
      }
    },
    {
      sectionId: "returns-analysis",
      sectionTitle: "Product Returns & Reasons",
      chartType: "pie",
      description: "Return reasons and associated costs",
      data: {
        returnReasons: [
          { reason: "Defective/Damaged", count: 4520, percentage: 28.5, cost: 485000 },
          { reason: "Wrong Item Shipped", count: 2850, percentage: 18.0, cost: 298000 },
          { reason: "Changed Mind", count: 3680, percentage: 23.2, cost: 182000 },
          { reason: "Better Price Found", count: 1950, percentage: 12.3, cost: 125000 },
          { reason: "Arrived Late", count: 1420, percentage: 9.0, cost: 95000 },
          { reason: "Description Mismatch", count: 1100, percentage: 6.9, cost: 78000 },
          { reason: "Other", count: 330, percentage: 2.1, cost: 28000 }
        ]
      }
    },
    {
      sectionId: "operational-kpis-table",
      sectionTitle: "Key Operational KPIs",
      chartType: "table",
      description: "Comprehensive operational metrics dashboard",
      data: {
        operationalKPIs: [
          {
            metric: "Order Cycle Time",
            current: "2.8 days",
            target: "2.5 days",
            lastMonth: "3.1 days",
            trend: "improving",
            status: "on-track"
          },
          {
            metric: "Perfect Order Rate",
            current: "94.5%",
            target: "95.0%",
            lastMonth: "93.8%",
            trend: "improving",
            status: "on-track"
          },
          {
            metric: "Inventory Accuracy",
            current: "98.2%",
            target: "99.0%",
            lastMonth: "97.9%",
            trend: "improving",
            status: "at-risk"
          },
          {
            metric: "Capacity Utilization",
            current: "86.5%",
            target: "85.0%",
            lastMonth: "84.2%",
            trend: "stable",
            status: "healthy"
          },
          {
            metric: "Return Rate",
            current: "3.8%",
            target: "3.0%",
            lastMonth: "4.2%",
            trend: "improving",
            status: "at-risk"
          },
          {
            metric: "Stock-out Rate",
            current: "2.1%",
            target: "1.5%",
            lastMonth: "2.5%",
            trend: "improving",
            status: "at-risk"
          },
          {
            metric: "Lead Time Variance",
            current: "±0.8 days",
            target: "±0.5 days",
            lastMonth: "±1.1 days",
            trend: "improving",
            status: "on-track"
          }
        ]
      }
    }
  ]
};

// ===============================================================================================
// HELPER FUNCTIONS & UTILITIES
// ===============================================================================================

export const dashboardConfig = {
  totalPages: 6,
  pages: [
    page1_executiveSummary,
    page2_salesPerformance,
    page3_productPerformance,
    page4_marketingPerformance,
    page5_customerInsights,
    page6_operationalMetrics
  ]
};

// Function to get all sections across all pages
export const getAllSections = () => {
  return dashboardConfig.pages.flatMap(page => 
    page.sections.map(section => ({
      ...section,
      pageTitle: page.pageTitle,
      pageNumber: page.pageNumber
    }))
  );
};

// Function to get sections by chart type
export const getSectionsByChartType = (chartType: string) => {
  return getAllSections().filter(section => section.chartType === chartType);
};

// Function to get page by number
export const getPageByNumber = (pageNumber: number) => {
  return dashboardConfig.pages.find(page => page.pageNumber === pageNumber);
};

// Function to calculate aggregated metrics
export const calculateAggregatedMetrics = () => {
  const totalRevenue = page1_executiveSummary.sections[1]?.data?.timeSeries
    ? page1_executiveSummary.sections[1].data.timeSeries.reduce((sum, month) => sum + month.revenue, 0)
    : 0;
  
  const totalProfit = page1_executiveSummary.sections[1]?.data?.timeSeries
    ? page1_executiveSummary.sections[1].data.timeSeries.reduce((sum, month) => sum + month.profit, 0)
    : 0;
  
  const totalCustomers = page2_salesPerformance.sections[3]?.data?.acquisitionMetrics
    ? page2_salesPerformance.sections[3].data.acquisitionMetrics.reduce((sum, month) => sum + month.leads, 0)
    : 0;

  return {
    totalRevenue,
    totalProfit,
    profitMargin: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : "0.00",
    totalCustomers,
    avgMonthlyRevenue: totalRevenue > 0 ? (totalRevenue / 12).toFixed(0) : "0"
  };
};

// Chart type reference guide
export const chartTypeMapping = {
  "kpi-cards": "Display as metric cards with values, changes, and targets",
  "multi-line": "Multiple line series on same chart for comparison",
  "grouped-bar": "Bars grouped by category for side-by-side comparison",
  "area": "Single filled area chart showing trend",
  "donut": "Pie chart with center hole showing percentage distribution",
  "horizontal-bar": "Bars oriented horizontally instead of vertically",
  "stacked-bar": "Bars stacked on top of each other showing composition",
  "scatter": "Points plotted on X-Y axis showing correlation",
  "treemap": "Nested rectangles showing hierarchical data",
  "line": "Single line chart showing trend over time",
  "stacked-area": "Multiple areas stacked showing cumulative values",
  "sankey": "Flow diagram showing movement between stages",
  "funnel": "Decreasing stages showing conversion process",
  "pie": "Circle divided into slices showing distribution",
  "multi-area": "Multiple overlapping area charts",
  "table": "Structured data in rows and columns"
};

// Export everything
export default {
  dashboardConfig,
  page1_executiveSummary,
  page2_salesPerformance,
  page3_productPerformance,
  page4_marketingPerformance,
  page5_customerInsights,
  page6_operationalMetrics,
  getAllSections,
  getSectionsByChartType,
  getPageByNumber,
  calculateAggregatedMetrics,
  chartTypeMapping
};