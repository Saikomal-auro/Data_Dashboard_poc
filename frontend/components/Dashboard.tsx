"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ChartVisualization from "./ChartVisualization";
import TableVisualization from "./TableVisualization";

import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { SearchResults } from "@/components/generative-ui/SearchResults";

// Import enterprise dashboard data
import {
  page1_executiveSummary,
  page2_salesPerformance,
  page3_productPerformance,
  page4_marketingPerformance,
  page5_customerInsights,
  page6_operationalMetrics,
  dashboardConfig,
  getAllSections,
  calculateAggregatedMetrics,
} from "@/data/dashboard-data";

export function Dashboard(): React.ReactElement {
  const [activePage, setActivePage] = useState(1);
  const aggregatedMetrics = calculateAggregatedMetrics();

  /* ================= Copilot context ================= */
  useCopilotReadable({
    description: "Enterprise business analytics dashboard with comprehensive multi-page reports covering executive summary, sales, products, marketing, customers, and operations",
    value: {
      currentPage: activePage,
      pages: dashboardConfig.pages.map(p => ({
        pageNumber: p.pageNumber,
        pageTitle: p.pageTitle,
        sectionCount: p.sections.length
      })),
      aggregatedMetrics,
      allSections: getAllSections(),
      executiveSummary: page1_executiveSummary,
      salesPerformance: page2_salesPerformance,
      productPerformance: page3_productPerformance,
      marketingPerformance: page4_marketingPerformance,
      customerInsights: page5_customerInsights,
      operationalMetrics: page6_operationalMetrics,
    },
  });

  useCopilotAction({
    name: "searchInternet",
    available: "disabled",
    description: "Search business insights and market data",
    parameters: [{ name: "query", type: "string", required: true }],
    render: ({ args, status }) => (
      <SearchResults query={args.query ?? ""} status={status} />
    ),
  });

  /* ================= PAGE RENDERERS ================= */

  const renderPage1 = () => {
    const kpiSection = page1_executiveSummary.sections[0];
    const kpis = kpiSection?.data?.kpis || [];

    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
        {/* KPI Cards */}
        <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" data-kpi-section>
          {kpis.map((kpi, idx) => (
            <Metric 
              key={idx}
              label={kpi.metric} 
              value={
                kpi.format === "currency" 
                  ? `$${kpi.value.toLocaleString()}` 
                  : kpi.format === "percent" 
                  ? `${kpi.value}%` 
                  : kpi.value.toLocaleString()
              } 
            />
          ))}
        </div>

      {/* Revenue Trend - Multi-line */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page1_executiveSummary.sections[1]?.sectionTitle}</CardTitle>
          <CardDescription>{page1_executiveSummary.sections[1]?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="line"
            data={page1_executiveSummary.sections[1]?.data?.timeSeries || []}
            xKey="month"
            yKeys={["revenue", "costs", "profit", "forecast"]}
            showTitle={false}
          />
        </CardContent>
      </Card>



     {/* ✅ NEW CARD 1: Revenue vs Target (Bar + Line) - NO CHANGES NEEDED */}
{/* ✅ NEW CARD 1: Revenue vs Target (Bar + Line) - NO CHANGES */}
<Card className="lg:col-span-2" data-chart-card>
  <CardHeader>
    <CardTitle>Revenue Performance vs Target</CardTitle>
    <CardDescription>Actual revenue (bars) compared to monthly targets (line)</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartVisualization
      chartType="bar-line"
      data={[
        { month: "Jan", revenue: 145000, target: 150000 },
        { month: "Feb", revenue: 162000, target: 155000 },
        { month: "Mar", revenue: 158000, target: 160000 },
        { month: "Apr", revenue: 171000, target: 165000 },
        { month: "May", revenue: 189000, target: 170000 },
        { month: "Jun", revenue: 195000, target: 175000 },
        { month: "Jul", revenue: 187000, target: 180000 },
        { month: "Aug", revenue: 203000, target: 185000 },
        { month: "Sep", revenue: 198000, target: 190000 },
        { month: "Oct", revenue: 215000, target: 195000 },
        { month: "Nov", revenue: 224000, target: 200000 },
        { month: "Dec", revenue: 236000, target: 210000 },
      ]}
      xKey="month"
      yKeys={["revenue", "target"]}
      showTitle={false}
    />
  </CardContent>
</Card>

{/* ✅ FIXED CARD 2: Profit values scaled to be visible (multiply by ~3000-5000) */}
<Card className="lg:col-span-2" data-chart-card>
  <CardHeader>
    <CardTitle>Cost Structure & Profitability</CardTitle>
    <CardDescription>Fixed and variable costs (stacked) with profit trend (line)</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartVisualization
      chartType="stacked-bar-line"
      data={[
        { month: "Jan", fixedCost: 45000, varCost: 62000, profitMargin: 110000 },  // 26% → scaled
        { month: "Feb", fixedCost: 45000, varCost: 71000, profitMargin: 120000 },  // 28% → scaled
        { month: "Mar", fixedCost: 45000, varCost: 68000, profitMargin: 118000 },  // 28% → scaled
        { month: "Apr", fixedCost: 46000, varCost: 74000, profitMargin: 125000 },  // 30% → scaled
        { month: "May", fixedCost: 46000, varCost: 83000, profitMargin: 135000 },  // 32% → scaled
        { month: "Jun", fixedCost: 47000, varCost: 87000, profitMargin: 130000 },  // 31% → scaled
        { month: "Jul", fixedCost: 47000, varCost: 82000, profitMargin: 128000 },  // 31% → scaled
        { month: "Aug", fixedCost: 48000, varCost: 91000, profitMargin: 133000 },  // 32% → scaled
        { month: "Sep", fixedCost: 48000, varCost: 88000, profitMargin: 130000 },  // 31% → scaled
        { month: "Oct", fixedCost: 49000, varCost: 96000, profitMargin: 135000 },  // 32% → scaled
        { month: "Nov", fixedCost: 49000, varCost: 102000, profitMargin: 138000 }, // 33% → scaled
        { month: "Dec", fixedCost: 50000, varCost: 108000, profitMargin: 140000 }, // 33% → scaled
      ]}
      xKey="month"
      yKeys={["fixedCost", "varCost", "profitMargin"]}
      showTitle={false}
    />
  </CardContent>
</Card>

      {/* Quarterly Comparison - Grouped Bar */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>{page1_executiveSummary.sections[2]?.sectionTitle}</CardTitle>
          <CardDescription>{page1_executiveSummary.sections[2]?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="grouped-bar"
            data={page1_executiveSummary.sections[2]?.data?.quarters || []}
            xKey="quarter"
            yKeys={["revenue", "profit", "expenses"]}
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Profit Margin - Area */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>{page1_executiveSummary.sections[3]?.sectionTitle}</CardTitle>
          <CardDescription>{page1_executiveSummary.sections[3]?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="area"
            data={page1_executiveSummary.sections[3]?.data?.margins || []}
            xKey="month"
            yKeys={["margin", "industry_avg"]}
            showTitle={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

  const renderPage2 = () => (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
      {/* Regional Sales - Donut */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>{page2_salesPerformance.sections[0].sectionTitle}</CardTitle>
          <CardDescription>{page2_salesPerformance.sections[0].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="donut"
            data={page2_salesPerformance.sections[0]?.data?.regions ?? []}
            nameKey="region"
            valueKey="revenue"
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Sales Rep Performance - Horizontal Bar */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>{page2_salesPerformance.sections[1].sectionTitle}</CardTitle>
          <CardDescription>{page2_salesPerformance.sections[1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="horizontal-bar"
            data={page2_salesPerformance.sections[1]?.data?.salesReps??[]}
            xKey="name"
            yKey="revenue"
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Customer Segments - Stacked Bar */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page2_salesPerformance.sections[2].sectionTitle}</CardTitle>
          <CardDescription>{page2_salesPerformance.sections[2].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="stacked-bar"
            data={page2_salesPerformance.sections[2]?.data?.segments??[]}
            xKey="month"
            yKeys={["enterprise", "midMarket", "smallBusiness"]}
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* CAC & LTV - Multi-line */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page2_salesPerformance.sections[3].sectionTitle}</CardTitle>
          <CardDescription>{page2_salesPerformance.sections[3].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="line"
            data={page2_salesPerformance.sections[3]?.data?.acquisitionMetrics??[]}
            xKey="month"
            yKeys={["cac", "ltv", "conversionRate"]}
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Sales Funnel */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page2_salesPerformance.sections[4].sectionTitle}</CardTitle>
          <CardDescription>{page2_salesPerformance.sections[4].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="funnel"
            data={page2_salesPerformance.sections[4]?.data?.funnelStages??[]}
            showTitle={false}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderPage3 = () => (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
      {/* Product Revenue - Treemap */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>{page3_productPerformance.sections[0].sectionTitle}</CardTitle>
          <CardDescription>{page3_productPerformance.sections[0].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="treemap"
            data={page3_productPerformance.sections[0]?.data?.products??[]}
            nameKey="sku"
            valueKey="revenue"
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Product Growth - Scatter */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>{page3_productPerformance.sections[1].sectionTitle}</CardTitle>
          <CardDescription>{page3_productPerformance.sections[1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="scatter"
            data={page3_productPerformance.sections[1]?.data?.categoryGrowth??[]}
            xKey="revenue"
            yKey="growthRate"
            labelKey="category"
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Inventory Turnover - Multi-line */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page3_productPerformance.sections[2].sectionTitle}</CardTitle>
          <CardDescription>{page3_productPerformance.sections[2].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="line"
            data={page3_productPerformance.sections[2]?.data?.turnoverData??[]}
            xKey="month"
            yKeys={["electronics", "appliances", "clothing", "homeKitchen"]}
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Stock Levels - Stacked Area */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page3_productPerformance.sections[3].sectionTitle}</CardTitle>
          <CardDescription>{page3_productPerformance.sections[3].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="stacked-area"
            data={page3_productPerformance.sections[3]?.data?.stockLevels??[]}
            xKey="month"
            yKeys={["electronics", "appliances", "clothing", "homeKitchen"]}
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Product Performance Table */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page3_productPerformance.sections[4].sectionTitle}</CardTitle>
          <CardDescription>{page3_productPerformance.sections[4].description}</CardDescription>
        </CardHeader>
        <CardContent>
     <TableVisualization
  title={page3_productPerformance.sections[4]?.sectionTitle ?? "Product Performance"}
  headers={Object.keys(page3_productPerformance.sections[4]?.data?.productMetrics?.[0] ?? {})}
  rows={page3_productPerformance.sections[4]?.data?.productMetrics ?? []}
  showTitle={false}
/>
        </CardContent>
      </Card>
    </div>
  );

  const renderPage4 = () => (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
      {/* Marketing Channel ROI - Grouped Bar */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page4_marketingPerformance.sections[0].sectionTitle}</CardTitle>
          <CardDescription>{page4_marketingPerformance.sections[0].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="grouped-bar"
            data={page4_marketingPerformance.sections[0]?.data?.channels??[]}
            xKey="channel"
            yKeys={["spend", "revenue"]}
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Campaign Performance - Multi-line */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page4_marketingPerformance.sections[1].sectionTitle}</CardTitle>
          <CardDescription>{page4_marketingPerformance.sections[1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="line"
            data={page4_marketingPerformance.sections[1]?.data?.campaignMetrics??[]}
            xKey="month"
            yKeys={["impressions", "clicks", "conversions"]}
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Social Media Engagement - Area */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page4_marketingPerformance.sections[3].sectionTitle}</CardTitle>
          <CardDescription>{page4_marketingPerformance.sections[3].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="area"
            data={page4_marketingPerformance.sections[3]?.data?.socialMetrics??[]}
            xKey="month"
            yKeys={["followers", "engagement", "reach"]}
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Top Content Table */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page4_marketingPerformance.sections[4].sectionTitle}</CardTitle>
          <CardDescription>{page4_marketingPerformance.sections[4].description}</CardDescription>
        </CardHeader>
        <CardContent>
       <TableVisualization
      title={page4_marketingPerformance.sections[4]?.sectionTitle ?? "Top Content"}
      headers={Object.keys(page4_marketingPerformance.sections[4]?.data?.contentPieces?.[0] ?? {})}
       rows={page4_marketingPerformance.sections[4]?.data?.contentPieces ?? []}
       showTitle={false}
/>
        </CardContent>
      </Card>
    </div>
  );

  const renderPage5 = () => (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
      {/* Age Distribution - Pie */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>Customer Age Distribution</CardTitle>
          <CardDescription>Demographics by age group</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="pie"
            data={page5_customerInsights.sections[0]?.data?.ageDistribution??[]}
            nameKey="ageGroup"
            valueKey="count"
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Income Distribution - Pie */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>Customer Income Distribution</CardTitle>
          <CardDescription>Demographics by income bracket</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="pie"
            data={page5_customerInsights.sections[0]?.data?.incomeDistribution??[]}
            nameKey="bracket"
            valueKey="count"
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Customer Satisfaction - Multi-line */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page5_customerInsights.sections[1].sectionTitle}</CardTitle>
          <CardDescription>{page5_customerInsights.sections[1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="line"
            data={page5_customerInsights.sections[1]?.data?.satisfactionTrend??[]}
            xKey="month"
            yKeys={["csat", "nps", "ces"]}
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Support Tickets - Stacked Bar */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page5_customerInsights.sections[2].sectionTitle}</CardTitle>
          <CardDescription>{page5_customerInsights.sections[2].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="stacked-bar"
            data={page5_customerInsights.sections[2]?.data?.ticketsByCategory??[]}
            xKey="month"
            yKeys={["technical", "billing", "shipping", "product", "other"]}
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* CLV Segments - Scatter */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>{page5_customerInsights.sections[3].sectionTitle}</CardTitle>
          <CardDescription>{page5_customerInsights.sections[3].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="scatter"
            data={page5_customerInsights.sections[3]?.data?.clvSegments??[]}
            xKey="ltv"
            yKey="frequency"
            labelKey="segment"
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Churn Analysis - Stacked Area */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>{page5_customerInsights.sections[4].sectionTitle}</CardTitle>
          <CardDescription>{page5_customerInsights.sections[4].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="stacked-area"
            data={page5_customerInsights.sections[4]?.data?.churnData??[]}
            xKey="month"
            yKeys={["overall", "enterprise", "midMarket", "smallBusiness"]}
            showTitle={false}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderPage6 = () => (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
      {/* Fulfillment Metrics - Multi-line */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page6_operationalMetrics.sections[0].sectionTitle}</CardTitle>
          <CardDescription>{page6_operationalMetrics.sections[0].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="line"
            data={page6_operationalMetrics.sections[0]?.data?.fulfillmentMetrics??[]}
            xKey="month"
            yKeys={["processingTime", "shippingTime", "onTimeDelivery"]}
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Warehouse Performance - Grouped Bar */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>{page6_operationalMetrics.sections[1].sectionTitle}</CardTitle>
          <CardDescription>{page6_operationalMetrics.sections[1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="grouped-bar"
            data={page6_operationalMetrics.sections[1]?.data?.warehousePerformance??[]}
            xKey="warehouse"
            yKeys={["utilization", "pickAccuracy"]}
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Supplier Performance - Scatter */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>{page6_operationalMetrics.sections[2].sectionTitle}</CardTitle>
          <CardDescription>{page6_operationalMetrics.sections[2].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="scatter"
            data={page6_operationalMetrics.sections[2]?.data?.supplierMetrics??[]}
            xKey="onTimeRate"
            yKey="qualityScore"
            labelKey="supplier"
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Logistics Costs - Stacked Area */}
      <Card className="col-span-full" data-chart-card>
        <CardHeader>
          <CardTitle>{page6_operationalMetrics.sections[3].sectionTitle}</CardTitle>
          <CardDescription>{page6_operationalMetrics.sections[3].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="stacked-area"
            data={page6_operationalMetrics.sections[3]?.data?.logisticsCosts??[]}
            xKey="month"
            yKeys={["transportation", "warehousing", "handling", "packaging"]}
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Return Reasons - Pie */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>{page6_operationalMetrics.sections[4].sectionTitle}</CardTitle>
          <CardDescription>{page6_operationalMetrics.sections[4].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="pie"
            data={page6_operationalMetrics.sections[4]?.data?.returnReasons??[]}
            nameKey="reason"
            valueKey="count"
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Operational KPIs Table */}
      <Card className="lg:col-span-2" data-chart-card>
        <CardHeader>
          <CardTitle>{page6_operationalMetrics.sections[5].sectionTitle}</CardTitle>
          <CardDescription>{page6_operationalMetrics.sections[5].description}</CardDescription>
        </CardHeader>
        <CardContent>
       <TableVisualization
  title={page6_operationalMetrics.sections[5]?.sectionTitle ?? "Operational KPIs"}
  headers={Object.keys(page6_operationalMetrics.sections[5]?.data?.operationalKPIs?.[0] ?? {})}
  rows={page6_operationalMetrics.sections[5]?.data?.operationalKPIs ?? []}
  showTitle={false}
/>
        </CardContent>
      </Card>
    </div>
  );

  const pages = [
    { number: 1, title: "Executive Summary", render: renderPage1 },
    { number: 2, title: "Sales Performance", render: renderPage2 },
    { number: 3, title: "Product Analytics", render: renderPage3 },
    { number: 4, title: "Marketing", render: renderPage4 },
    { number: 5, title: "Customer Insights", render: renderPage5 },
    { number: 6, title: "Operations", render: renderPage6 },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Header with Aggregated Metrics */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" data-kpi-section>
        <Metric label="Total Revenue" value={`$${aggregatedMetrics.totalRevenue.toLocaleString()}`} />
        <Metric label="Total Profit" value={`$${aggregatedMetrics.totalProfit.toLocaleString()}`} />
        <Metric label="Profit Margin" value={`${aggregatedMetrics.profitMargin}%`} />
        <Metric label="Total Customers" value={aggregatedMetrics.totalCustomers.toLocaleString()} />
        <Metric label="Avg Monthly Revenue" value={`$${aggregatedMetrics.avgMonthlyRevenue}`} />
      </div> */}

      {/* Page Navigation */}
      <Card data-navigation-card>
        <CardHeader>
          <CardTitle>Dashboard Navigation</CardTitle>
          <CardDescription>Select a page to view detailed analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {pages.map((page) => (
              <button
                key={page.number}
                onClick={() => setActivePage(page.number)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activePage === page.number
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="font-bold">{page.number}.</span> {page.title}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Page Content */}
      {pages.find((p) => p.number === activePage)?.render()}
    </div>
  );
}

/* ================= KPI CARD ================= */
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}