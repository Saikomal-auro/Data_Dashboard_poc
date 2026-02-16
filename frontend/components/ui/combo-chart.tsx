"use client"

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { CHART_COLORS } from "./chart-colors"

interface ChartDataItem {
  [key: string]: string | number
}

type ScaleType = "auto" | "fromZero" | "percentage" | "custom"

interface ComboChartProps {
  data: ChartDataItem[]
  index: string
  
  // Separate categories by chart type
  lineCategories?: string[]
  areaCategories?: string[]
  barCategories?: string[]
  
  colors?: string[]
  valueFormatter?: (value: number) => string
  className?: string
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  yAxisWidth?: number
  stackBars?: boolean
  
  // ✅ Y-Axis scaling options
  yScaleType?: ScaleType
  yAxisDomain?: [number | string, number | string]
  yPaddingPercent?: number  // Now optional - will auto-calculate if not provided
  
  // ✅ X-Axis scaling options (for numeric X-axis)
  xScaleType?: ScaleType
  xAxisDomain?: [number | string, number | string]
  xPaddingPercent?: number  // Now optional - will auto-calculate if not provided
}

const truncateText = (text: string, maxLength: number = 12) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

// ✅ NEW: Calculate smart padding based on coefficient of variation
const calculateSmartPadding = (
  minValue: number,
  maxValue: number,
  chartType: 'axis'
): number => {
  const range = maxValue - minValue;
  
  // Edge case: flat data
  if (range === 0) return 10;
  
  // Calculate coefficient of variation (range relative to midpoint)
  const midpoint = (minValue + maxValue) / 2;
  
  // Avoid division by zero
  if (midpoint === 0) return 10;
  
  const coeffVar = range / Math.abs(midpoint);
  
  // Map coefficient of variation to padding percentage
  if (coeffVar < 0.05) {
    // Very small variation (< 5%) - need high padding to avoid misleading zoom
    return 25;
  } else if (coeffVar < 0.15) {
    // Small variation (5-15%) - moderate-high padding
    return 20;
  } else if (coeffVar < 0.50) {
    // Medium variation (15-50%) - standard padding
    return 10;
  } else if (coeffVar < 1.0) {
    // Large variation (50-100%) - low padding
    return 8;
  } else {
    // Very large variation (>100%) - minimal padding
    return 5;
  }
};

// ✅ UPDATED: Helper function to calculate smart domain with auto-padding
const calculateDomain = (
  data: ChartDataItem[],
  keys: string[],
  scaleType: ScaleType,
  customDomain?: [number | string, number | string],
  paddingPercent?: number,  // ← Now optional
  chartType: 'axis' = 'axis'
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
      // ✅ NEW: Auto-calculate padding if not provided
      const effectivePaddingPercent = paddingPercent ?? calculateSmartPadding(
        minValue,
        maxValue,
        chartType
      );
      
      const padding = range * (effectivePaddingPercent / 100);
      
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

export function ComboChart({
  data,
  index,
  lineCategories = [],
  areaCategories = [],
  barCategories = [],
  colors = [...CHART_COLORS],
  valueFormatter = (value: number) => `${value}`,
  className,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  yAxisWidth = 55,
  stackBars = false,
  
  // Y-Axis scaling
  yScaleType = "auto",
  yAxisDomain,
  yPaddingPercent,  // ✅ Now optional - auto-calculated if not provided
  
  // X-Axis scaling
  xScaleType,
  xAxisDomain,
  xPaddingPercent,  // ✅ Now optional - auto-calculated if not provided
}: ComboChartProps) {
  
  // ✅ Combine all Y categories to calculate Y-axis domain
  const allYCategories = [
    ...lineCategories,
    ...areaCategories,
    ...barCategories
  ];
  
  // ✅ Calculate Y-axis domain based on all data (with auto-padding)
  const calculatedYDomain = calculateDomain(
    data,
    allYCategories,
    yScaleType,
    yAxisDomain,
    yPaddingPercent  // Will auto-calculate if undefined
  );
  
  // ✅ Calculate X-axis domain (only if xScaleType is specified for numeric X-axis)
  const calculatedXDomain = xScaleType 
    ? calculateDomain(
        data,
        [index],
        xScaleType,
        xAxisDomain,
        xPaddingPercent  // Will auto-calculate if undefined
      )
    : undefined;
  
  // ✅ Determine X-axis type: "number" if xScaleType specified, otherwise "category"
  const xAxisType = xScaleType ? "number" : "category";
  
  let colorIndex = 0;

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <ComposedChart
        data={data}
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
            dataKey={index}
            type={xAxisType}  // ✅ Dynamic: "number" or "category"
            domain={calculatedXDomain}  // ✅ Apply X-axis domain if numeric
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            dy={10}
            tickFormatter={(value) => truncateText(String(value), 12)}
          />
        )}

        {showYAxis && (
          <YAxis
            tickFormatter={valueFormatter}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            width={yAxisWidth}
            domain={calculatedYDomain}  // ✅ Apply Y-axis domain with auto-padding
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

        {/* Render Bars */}
        {barCategories.map((category) => {
          const color = colors[colorIndex % colors.length];
          colorIndex++;
          return (
            <Bar
              key={category}
              dataKey={category}
              fill={color}
              stroke={color}
              fillOpacity={1}
              strokeWidth={0}
              stackId={stackBars ? "stack" : undefined}
              radius={[4, 4, 0, 0]}
              barSize={30}
              animationDuration={500}
            />
          );
        })}

        {/* Render Areas */}
        {areaCategories.map((category) => {
          const color = colors[colorIndex % colors.length];
          colorIndex++;
          return (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stroke={color}
              fill={color}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          );
        })}

        {/* Render Lines */}
        {lineCategories.map((category) => {
          const color = colors[colorIndex % colors.length];
          colorIndex++;
          return (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={color}
              strokeWidth={2.5}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          );
        })}
      </ComposedChart>
    </ResponsiveContainer>
  )
}