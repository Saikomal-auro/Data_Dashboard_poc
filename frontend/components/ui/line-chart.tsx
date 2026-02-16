"use client"

import {
  Line,
  LineChart as RechartsLineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { CHART_COLORS } from "./chart-colors"

/* ================= TYPES ================= */

interface ChartDataItem {
  [key: string]: string | number
}

type ScaleType = "auto" | "fromZero" | "percentage" | "custom"

interface LineChartProps {
  data: ChartDataItem[]
  index: string
  categories: string[]          // 1 = single-line, >1 = multi-line
  colors?: string[]
  valueFormatter?: (value: number) => string
  className?: string
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  yAxisWidth?: number
  
  // ✅ Y-Axis scaling options
  yScaleType?: ScaleType
  yAxisDomain?: [number | string, number | string]
  yPaddingPercent?: number
  
  // ✅ X-Axis scaling options (for numeric X-axis)
  xScaleType?: ScaleType
  xAxisDomain?: [number | string, number | string]
  xPaddingPercent?: number
}

/* ================= HELPER FUNCTION ================= */

// ✅ Helper function to calculate smart domain
const calculateDomain = (
  data: ChartDataItem[],
  keys: string[],
  scaleType: ScaleType,
  customDomain?: [number | string, number | string],
  paddingPercent: number = 10
): [number | string, number | string] | undefined => {
  
  // If custom domain provided, use it
  if (customDomain) return customDomain;

  // Get all numeric values from all keys
  const allValues: number[] = [];
  data.forEach(item => {
    keys.forEach(key => {
      const value = item[key];
      if (typeof value === 'number') {
        allValues.push(value);
      }
    });
  });

  if (allValues.length === 0) return [0, 'auto'];

  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const range = maxValue - minValue;

  switch (scaleType) {
    case 'percentage':
      // Always 0-100 for percentages
      return [0, 100];

    case 'fromZero':
      // Always start from 0
      return [0, 'auto'];

    case 'auto':
      // Smart auto-scaling with padding
      const padding = range * (paddingPercent / 100);
      
      // If data has negative values, center around zero
      if (minValue < 0 && maxValue > 0) {
        return ['auto', 'auto'];
      }
      
      // For positive-only data, add padding
      const paddedMin = Math.max(0, minValue - padding);
      const paddedMax = maxValue + padding;
      
      return [
        Math.floor(paddedMin),
        Math.ceil(paddedMax)
      ];

    case 'custom':
      return customDomain || [0, 'auto'];

    default:
      return [0, 'auto'];
  }
};

/* ================= COMPONENT ================= */

export function LineChart({
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
  
  // Y-Axis scaling
  yScaleType = "auto",
  yAxisDomain,
  yPaddingPercent = 10,
  
  // X-Axis scaling
  xScaleType,
  xAxisDomain,
  xPaddingPercent = 5,
}: LineChartProps) {
  const isMultiLine = categories.length > 1

  // ✅ Calculate Y-axis domain based on all categories
  const calculatedYDomain = calculateDomain(
    data,
    categories,
    yScaleType,
    yAxisDomain,
    yPaddingPercent
  );
  
  // ✅ Calculate X-axis domain (only if xScaleType is specified for numeric X-axis)
  const calculatedXDomain = xScaleType 
    ? calculateDomain(
        data,
        [index],
        xScaleType,
        xAxisDomain,
        xPaddingPercent
      )
    : undefined;
  
  // ✅ Determine X-axis type: "number" if xScaleType specified, otherwise "category"
  const xAxisType = xScaleType ? "number" : "category";

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsLineChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        {/* -------- Grid -------- */}
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
        )}

        {/* -------- X Axis -------- */}
        {showXAxis && (
          <XAxis
            dataKey={index}
            type={xAxisType}  // ✅ Dynamic: "number" or "category"
            domain={calculatedXDomain}  // ✅ Apply X-axis domain if numeric
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            dy={10}
          />
        )}

        {/* -------- Y Axis -------- */}
        {showYAxis && (
          <YAxis
            tickFormatter={valueFormatter}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            width={yAxisWidth}
            domain={calculatedYDomain}  // ✅ Apply Y-axis domain
          />
        )}

        {/* -------- Tooltip -------- */}
        <Tooltip
          formatter={(value: number, name: string) => [valueFormatter(value), name]}
          labelFormatter={(label) => `${label}`}
          separator=": "
          itemStyle={{ padding: "2px 0" }}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.375rem",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            padding: "0.5rem 0.75rem",
          }}
        />

        {/* -------- Legend (only when multi-line) -------- */}
        {showLegend && isMultiLine && (
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

        {/* -------- Lines -------- */}
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            strokeWidth={isMultiLine ? 2 : 2.5}   // 👈 stronger for single line
            dot={false}
            activeDot={{ r: isMultiLine ? 5 : 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}