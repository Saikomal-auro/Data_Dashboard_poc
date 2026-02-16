"use client"

import {
  ResponsiveContainer,
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { CHART_COLORS } from "./chart-colors"

interface ChartDataItem {
  [key: string]: string | number
}

type ScaleType = "auto" | "fromZero" | "percentage" | "custom"

interface ScatterChartProps {
  data: ChartDataItem[]
  xKey: string
  yKey: string
  labelKey?: string
  color?: string
  className?: string
  
  // Scaling options
  xScaleType?: ScaleType
  yScaleType?: ScaleType
  xDomain?: [number | string, number | string]
  yDomain?: [number | string, number | string]
  xPaddingPercent?: number  // Now optional - will auto-calculate if not provided
  yPaddingPercent?: number  // Now optional - will auto-calculate if not provided
  
  // Display options
  showGrid?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
}

function CustomTooltip({ active, payload, xKey, yKey, labelKey }: any) {
  if (!active || !payload || !payload.length) return null

  const d = payload[0].payload

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm px-3 py-2 text-sm">
      {labelKey && (
        <p className="font-semibold text-gray-800 mb-1">
          {d[labelKey]}
        </p>
      )}
      <p><b>{xKey}:</b> {d[xKey]}</p>
      <p><b>{yKey}:</b> {d[yKey]}</p>
    </div>
  )
}

// ✅ NEW: Calculate smart padding based on coefficient of variation
const calculateSmartPadding = (
  minValue: number,
  maxValue: number
): number => {
  const range = maxValue - minValue;
  
  // Edge case: flat data
  if (range === 0) return 5;  // Scatter charts use lower default
  
  // Calculate coefficient of variation (range relative to midpoint)
  const midpoint = (minValue + maxValue) / 2;
  
  // Avoid division by zero
  if (midpoint === 0) return 5;
  
  const coeffVar = range / Math.abs(midpoint);
  
  // Map coefficient of variation to padding percentage
  // Note: Scatter charts generally need less padding than line/bar charts
  // to show clustering patterns clearly
  if (coeffVar < 0.05) {
    // Very small variation (< 5%) - need high padding to avoid misleading zoom
    return 20;
  } else if (coeffVar < 0.15) {
    // Small variation (5-15%) - moderate padding
    return 15;
  } else if (coeffVar < 0.50) {
    // Medium variation (15-50%) - standard padding for scatter
    return 8;
  } else if (coeffVar < 1.0) {
    // Large variation (50-100%) - low padding
    return 5;
  } else {
    // Very large variation (>100%) - minimal padding
    return 3;
  }
};

// ✅ UPDATED: Helper function to calculate smart domain with auto-padding
const calculateDomain = (
  data: ChartDataItem[],
  key: string,
  scaleType: ScaleType,
  customDomain?: [number | string, number | string],
  paddingPercent?: number  // ← Now optional
): [number | string, number | string] => {
  
  // If custom domain provided, use it
  if (customDomain) return customDomain;

  // Get all values for this key
  const values: number[] = data
    .map(item => item[key])
    .filter(val => typeof val === 'number') as number[];

  if (values.length === 0) return [0, 'auto'];

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
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
        maxValue
      );
      
      const padding = range * (effectivePaddingPercent / 100);
      
      // If data has negative values, use auto
      if (minValue < 0 && maxValue > 0) {
        return ['auto', 'auto'];
      }
      
      // For positive-only data, add padding
      // Calculate numeric values for better control
      const paddedMin = Math.max(0, minValue - padding); // Don't go below 0 for positive data
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

export function ScatterChart({
  data,
  xKey,
  yKey,
  labelKey,
  color = CHART_COLORS[0],
  className,
  
  xScaleType = "auto",  // Auto-scale X by default for scatter
  yScaleType = "auto",  // Auto-scale Y by default for scatter
  xDomain,
  yDomain,
  xPaddingPercent,  // ✅ Now optional - auto-calculated if not provided
  yPaddingPercent,  // ✅ Now optional - auto-calculated if not provided
  
  showGrid = true,
  xAxisLabel,
  yAxisLabel,
}: ScatterChartProps) {
  
  // ✅ Calculate domains for both axes (with auto-padding)
  const calculatedXDomain = calculateDomain(
    data, 
    xKey, 
    xScaleType, 
    xDomain, 
    xPaddingPercent  // Will auto-calculate if undefined
  );
  const calculatedYDomain = calculateDomain(
    data, 
    yKey, 
    yScaleType, 
    yDomain, 
    yPaddingPercent  // Will auto-calculate if undefined
  );
  
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb"
          />
        )}
        
        <XAxis 
          dataKey={xKey} 
          type="number"
          domain={calculatedXDomain}  // ✅ Apply X-axis domain with auto-padding
          label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10 } : undefined}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={{ stroke: "#d1d5db" }}
          tickLine={false}
        />
        
        <YAxis 
          dataKey={yKey} 
          type="number"
          domain={calculatedYDomain}  // ✅ Apply Y-axis domain with auto-padding
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={{ stroke: "#d1d5db" }}
          tickLine={false}
        />

        <Tooltip
          content={
            <CustomTooltip
              xKey={xKey}
              yKey={yKey}
              labelKey={labelKey}
            />
          }
          cursor={{ strokeDasharray: '3 3' }}
        />

        <Scatter 
          data={data} 
          fill={color}
          fillOpacity={0.8}
        />
      </RechartsScatterChart>
    </ResponsiveContainer>
  )
}