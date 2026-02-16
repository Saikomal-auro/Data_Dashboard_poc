"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ChartVisualization from "@/components/charts/chart-visualization";

import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { SearchResults } from "@/components/generative-ui/SearchResults";

import {
  salesData,
  productData,
  categoryData,
  regionalData,
  demographicsData,
  calculateTotalRevenue,
  calculateTotalProfit,
  calculateTotalCustomers,
  calculateConversionRate,
  calculateAverageOrderValue,
  calculateProfitMargin,
} from "@/data/dashboard-data";

export function Dashboard() {
  // -----------------------------
  // KPI calculations
  // -----------------------------
  const totalRevenue = calculateTotalRevenue();
  const totalProfit = calculateTotalProfit();
  const totalCustomers = calculateTotalCustomers();
  const conversionRate = calculateConversionRate();
  const averageOrderValue = calculateAverageOrderValue();
  const profitMargin = calculateProfitMargin();

  // -----------------------------
  // Copilot readable context
  // -----------------------------
  useCopilotReadable({
    description:
      "Business dashboard containing sales, product, category, regional and customer metrics",
    value: {
      salesData,
      productData,
      categoryData,
      regionalData,
      demographicsData,
      metrics: {
        totalRevenue,
        totalProfit,
        totalCustomers,
        conversionRate,
        averageOrderValue,
        profitMargin,
      },
    },
  });

  // -----------------------------
  // Copilot render-only action
  // -----------------------------
  useCopilotAction({
    name: "searchInternet",
    available: "disabled",
    description: "Searches the internet for business-related information",
    parameters: [
      {
        name: "query",
        type: "string",
        required: true,
      },
    ],
    render: ({ args, status }) => (
      <SearchResults query={args.query} status={status} />
    ),
  });

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">

      {/* ================= KPIs ================= */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Metric label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} />
          <Metric label="Total Profit" value={`$${totalProfit.toLocaleString()}`} />
          <Metric label="Customers" value={totalCustomers.toLocaleString()} />
          <Metric label="Conversion Rate" value={conversionRate} />
          <Metric label="Avg Order Value" value={`$${averageOrderValue}`} />
          <Metric label="Profit Margin" value={profitMargin} />
        </div>
      </div>

      {/* ================= Charts ================= */}

      {/* Sales Overview */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Monthly sales trend</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="area"
            title="Sales Trend"
            data={salesData}
            xKey="date"
            yKey="Sales"
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Product Performance */}
      <Card className="col-span-1 md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>Top selling products</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="bar"
            title="Product Sales"
            data={productData}
            xKey="name"
            yKey="sales"
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Sales by Category */}
      <Card className="col-span-1 md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
          <CardDescription>Category-wise distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="pie"
            title="Category Distribution"
            data={categoryData}
            xKey="name"
            yKey="value"
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Regional Sales */}
      <Card className="col-span-1 md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Regional Sales</CardTitle>
          <CardDescription>Sales by region</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="bar"
            title="Regional Sales"
            data={regionalData}
            xKey="region"
            yKey="sales"
            showTitle={false}
          />
        </CardContent>
      </Card>

      {/* Customer Demographics */}
      <Card className="col-span-1 md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Customer Demographics</CardTitle>
          <CardDescription>Spending by age group</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartVisualization
            chartType="bar"
            title="Age Group Spending"
            data={demographicsData}
            xKey="ageGroup"
            yKey="spending"
            showTitle={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= KPI Card ================= */

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
