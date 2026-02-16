"use client"

import { Area, AreaChart as RechartsAreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { CHART_COLORS } from "./chart-colors"

// Define a generic type for chart data
interface ChartDataItem {
  [key: string]: string | number;
}

interface AreaChartProps {
  data: ChartDataItem[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  className?: string
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  yAxisWidth?: number
  stack?: boolean
}

// Helper function to truncate long text (same as bar chart)
const truncateText = (text: string, maxLength: number = 12) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export function AreaChart({
  data,
  index,
  categories,
  colors = [...CHART_COLORS],
  valueFormatter = (value: number) => `${value}`,
  className,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  yAxisWidth = 55,
  stack = false,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />}
        
        {showXAxis && (
          <XAxis 
            dataKey={index} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#6b7280", fontSize: 12 }}
            dy={10}
            tickFormatter={(value) => {
              if (typeof value === 'number') return valueFormatter(value);
              return truncateText(String(value), 12);
            }}
          />
        )}
        
        {showYAxis && (
          <YAxis 
            tickFormatter={(value) => {
              if (typeof value === 'number') return valueFormatter(value);
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
          contentStyle={{ 
            backgroundColor: "white", 
            borderRadius: "0.375rem",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            padding: "0.5rem 0.75rem",
          }}
          itemSorter={(item: any) => {
            // For stacked charts, reverse the order to match visual appearance (top to bottom)
            if (stack) {
              const categoryIndex = categories.indexOf(item.dataKey);
              return categoryIndex * -1;
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
              <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>{value}</span>
            )}
          />
        )}
        
        {categories.map((category, i) => (
          <Area
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            fill={colors[i % colors.length]}
            fillOpacity={stack ? 0.6 : 0.1}
            strokeWidth={2}
            activeDot={{ r: 6, strokeWidth: 0 }}
            stackId={stack ? "stack" : undefined}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}
