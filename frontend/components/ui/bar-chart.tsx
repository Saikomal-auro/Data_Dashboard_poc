"use client"

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { CHART_COLORS } from "./chart-colors"

// Generic chart data type
interface ChartDataItem {
  [key: string]: string | number
}

type Orientation = "horizontal" | "vertical"
type Variant = "single" | "grouped" | "stacked"

interface BarChartProps {
  data: ChartDataItem[]
  index: string
  categories: string[]

  orientation?: Orientation
  variant?: Variant

  colors?: string[]
  valueFormatter?: (value: number) => string
  className?: string
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  yAxisWidth?: number
}

// Helper function to truncate long text
const truncateText = (text: string, maxLength: number = 12) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export function BarChart({
  data,
  index,
  categories,
  orientation = "vertical", // Default to vertical bars (most common)
  variant = "grouped",

  colors = [...CHART_COLORS],
  valueFormatter = (value: number) => `${value}`,
  className,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  yAxisWidth = 55,
}: BarChartProps) {
  // FIX: Correct interpretation - vertical bars grow upward, horizontal bars grow rightward
  const isVerticalBars = orientation === "vertical"

  const effectiveCategories =
    variant === "single" ? [categories[0]] : categories

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsBarChart
        data={data}
        // CRITICAL FIX: Recharts layout is counterintuitive
        // layout="horizontal" = vertical bars (categories on X-axis, values grow upward)
        // layout="vertical" = horizontal bars (categories on Y-axis, values grow rightward)
        layout={isVerticalBars ? "horizontal" : "vertical"}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
        )}

        {showXAxis && (
          <XAxis
            // For vertical bars: show categories on X-axis
            // For horizontal bars: show values on X-axis
            dataKey={isVerticalBars ? index : undefined}
            type={isVerticalBars ? "category" : "number"}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            dy={10}
            tickFormatter={(value) => {
              // If it's a number, format it; otherwise truncate text
              if (typeof value === 'number') return valueFormatter(value);
              return truncateText(String(value), 12);
            }}
          />
        )}

        {showYAxis && (
          <YAxis
            // For vertical bars: show values on Y-axis
            // For horizontal bars: show categories on Y-axis
            dataKey={!isVerticalBars ? index : undefined}
            type={isVerticalBars ? "number" : "category"}
            tickFormatter={(value) => {
              // If it's a number type (values), format as number
              if (typeof value === 'number') return valueFormatter(value);
              // If it's a category (labels), truncate text
              return truncateText(String(value), 12);
            }}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            width={yAxisWidth}
          />
        )}

        <Tooltip
          formatter={(value: number, name: string) => [valueFormatter(value), name]}
          labelFormatter={(value) => `${value}`}
          separator=": "
          itemStyle={{ padding: "2px 0" }}
          cursor={{ fill: "rgba(236,236,236,0.4)" }}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.375rem",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
            padding: "0.5rem 0.75rem",
          }}
          itemSorter={(item: any) => {
            // For stacked charts, reverse the order (show from top to bottom of stack)
            if (variant === "stacked") {
              const categoryIndex = effectiveCategories.indexOf(item.dataKey);
              return categoryIndex * -1; // Negative to reverse
            }
            return 0;
          }}
        />

        {showLegend && (
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                {value}
              </span>
            )}
          />
        )}

        {effectiveCategories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            fillOpacity={1}
            stackId={variant === "stacked" ? "stack" : undefined}
            // Only round corners on the top-most segment for stacked charts
            radius={variant === "stacked" && i === effectiveCategories.length - 1 
              ? (isVerticalBars ? [4, 4, 0, 0] : [0, 4, 4, 0]) 
              : variant === "stacked" 
              ? 0 
              : (isVerticalBars ? [4, 4, 0, 0] : [0, 4, 4, 0])}
            barSize={isVerticalBars ? 45 : 30}
            animationDuration={500}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}