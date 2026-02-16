"use client"

import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, Text } from "recharts"

// Define a generic type for chart data
interface ChartDataItem {
  [key: string]: string | number;
}

// Define tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  valueFormatter?: (value: number) => string;
}

// Custom tooltip component for the pie chart
const CustomTooltip = ({ active, payload, valueFormatter }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm text-sm">
        <p className="font-medium text-gray-700">{payload[0].name}</p>
        <p style={{ color: payload[0].color }}>{valueFormatter ? valueFormatter(payload[0].value) : `${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

interface PieChartProps {
  data: ChartDataItem[]
  category: string
  index: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  className?: string
  innerRadius?: number
  outerRadius?: string | number
  paddingAngle?: number
  showLabel?: boolean
  showLegend?: boolean
  centerText?: string
}

// Define label props
interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomizedLabelProps) => {
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {/* {`${(percent * 100).toFixed(0)}%`} */}
    </text>
  )
}

export function PieChart({
  data,
  category,
  index,
  colors = ["#3b82f6", "#64748b", "#10b981", "#f59e0b", "#94a3b8","#ec4899","#14b8a6"],
  valueFormatter = (value: number) => `${value}`,
  className,
  innerRadius = 0,
  outerRadius = "80%",
  paddingAngle = 2,
  showLabel = true,
  showLegend = true,
  centerText,
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          dataKey={category}
          nameKey={index}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={paddingAngle}
          label={showLabel ? renderCustomizedLabel : undefined}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
              fillOpacity={0.1}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
            />
          ))}
          {centerText && (
            <Text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg font-medium"
              fill="#374151"
            >
              {centerText}
            </Text>
          )}
        </Pie>
        <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
        {showLegend && (
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>{value}</span>
            )}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

export function DonutChart(props: PieChartProps) {
  return (
    <PieChart 
      {...props} 
      innerRadius={props.innerRadius || 40}
      outerRadius={props.outerRadius || "85%"}
      showLabel={props.showLabel !== undefined ? props.showLabel : false}
      showLegend={props.showLegend !== undefined ? props.showLegend : true}
    />
  )
}

// ============= GAUGE/SPEEDOMETER CHARTS =============

interface GaugeChartProps {
  value: number // Current value (0-100)
  max?: number // Maximum value (default: 100)
  label?: string // Label to display
  colors?: string[] // Color gradient for gauge
  valueFormatter?: (value: number) => string
  className?: string
  showNeedle?: boolean // Show needle pointer
  thresholds?: {
    low: number // e.g., 0-33
    medium: number // e.g., 34-66
    high: number // e.g., 67-100
  }
}

// 1. SEMICIRCLE GAUGE (Classic Speedometer)
export function SemiCircleGauge({
  value,
  max = 100,
  label = "Progress",
  colors = ["#ef4444", "#f59e0b", "#10b981"],
  valueFormatter = (val: number) => `${val}%`,
  className,
  showNeedle = true,
}: GaugeChartProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  // Create gauge data (semicircle)
  const gaugeData = [
    { name: "Progress", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ]

  // Needle angle calculation (-90 to 90 degrees)
  const needleAngle = -90 + (percentage * 1.8)

  return (
    <div className={`relative ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Pie
            data={gaugeData}
            dataKey="value"
            cx="50%"
            cy="85%"
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="90%"
            paddingAngle={0}
            stroke="none"
          >
            <Cell fill={colors[0]} fillOpacity={0.15} stroke={colors[0]} strokeWidth={3} />
            <Cell fill="#e5e7eb" fillOpacity={0.3} stroke="#d1d5db" strokeWidth={2} />
          </Pie>
          
          {/* Center text */}
          <Text
            x="50%"
            y="75%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-3xl font-bold"
            fill="#374151"
          >
            {valueFormatter(value)}
          </Text>
          <Text
            x="50%"
            y="85%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm"
            fill="#6b7280"
          >
            {label}
          </Text>
        </RechartsPieChart>
      </ResponsiveContainer>
      
      {/* Needle */}
      {showNeedle && (
        <div 
          className="absolute bottom-[15%] left-1/2 w-1 h-[35%] bg-gray-700 origin-bottom transition-transform duration-500"
          style={{ 
            transform: `translateX(-50%) rotate(${needleAngle}deg)`,
            transformOrigin: 'bottom center'
          }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-700 rounded-full" />
        </div>
      )}
    </div>
  )
}

// 2. FULL CIRCLE GAUGE (360° Progress)
export function CircleGauge({
  value,
  max = 100,
  label = "Progress",
  colors = ["#3b82f6"],
  valueFormatter = (val: number) => `${val}%`,
  className,
}: GaugeChartProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const gaugeData = [
    { name: "Progress", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={gaugeData}
          dataKey="value"
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={-270}
          innerRadius="70%"
          outerRadius="85%"
          paddingAngle={0}
          stroke="none"
        >
          <Cell fill={colors[0]} fillOpacity={0.15} stroke={colors[0]} strokeWidth={4} />
          <Cell fill="#e5e7eb" fillOpacity={0.3} stroke="#d1d5db" strokeWidth={2} />
        </Pie>
        
        <Text
          x="50%"
          y="45%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-3xl font-bold"
          fill="#374151"
        >
          {valueFormatter(value)}
        </Text>
        <Text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm"
          fill="#6b7280"
        >
          {label}
        </Text>
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

// 3. MULTI-THRESHOLD GAUGE (Color zones)
export function ThresholdGauge({
  value,
  max = 100,
  label = "Performance",
  colors = ["#ef4444", "#f59e0b", "#10b981"],
  valueFormatter = (val: number) => `${val}%`,
  className,
  thresholds = { low: 33, medium: 66, high: 100 },
}: GaugeChartProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  // Create threshold zones
  const gaugeData = [
    { name: "Low", value: thresholds.low, color: colors[0] },
    { name: "Medium", value: thresholds.medium - thresholds.low, color: colors[1] },
    { name: "High", value: thresholds.high - thresholds.medium, color: colors[2] },
  ]

  // Determine current zone color
  let currentColor = colors[0]
  if (percentage > thresholds.medium) currentColor = colors[2]
  else if (percentage > thresholds.low) currentColor = colors[1]

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        {/* Background zones */}
        <Pie
          data={gaugeData}
          dataKey="value"
          cx="50%"
          cy="85%"
          startAngle={180}
          endAngle={0}
          innerRadius="65%"
          outerRadius="85%"
          paddingAngle={2}
          stroke="none"
        >
          {gaugeData.map((entry, index) => (
            <Cell key={`zone-${index}`} fill={entry.color} fillOpacity={0.2} />
          ))}
        </Pie>
        
        {/* Progress indicator */}
        <Pie
          data={[
            { value: percentage },
            { value: 100 - percentage }
          ]}
          dataKey="value"
          cx="50%"
          cy="85%"
          startAngle={180}
          endAngle={0}
          innerRadius="70%"
          outerRadius="80%"
          paddingAngle={0}
          stroke="none"
        >
          <Cell fill={currentColor} stroke={currentColor} strokeWidth={3} />
          <Cell fill="transparent" />
        </Pie>
        
        <Text
          x="50%"
          y="70%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-3xl font-bold"
          fill={currentColor}
        >
          {valueFormatter(value)}
        </Text>
        <Text
          x="50%"
          y="80%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm"
          fill="#6b7280"
        >
          {label}
        </Text>
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

// 4. MINIMAL GAUGE (Simple arc)
export function MinimalGauge({
  value,
  max = 100,
  label = "Score",
  colors = ["#8b5cf6"],
  valueFormatter = (val: number) => `${val}`,
  className,
}: GaugeChartProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const gaugeData = [
    { name: "Progress", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsPieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
        <Pie
          data={gaugeData}
          dataKey="value"
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={-270}
          innerRadius="80%"
          outerRadius="90%"
          paddingAngle={0}
          stroke="none"
        >
          <Cell fill={colors[0]} fillOpacity={0.2} stroke={colors[0]} strokeWidth={6} />
          <Cell fill="transparent" />
        </Pie>
        
        <Text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-4xl font-bold"
          fill="#374151"
        >
          {valueFormatter(value)}
        </Text>
        <Text
          x="50%"
          y="62%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs uppercase tracking-wide"
          fill="#9ca3af"
        >
          {label}
        </Text>
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

// 5. SPEEDOMETER GAUGE (With tick marks)
export function SpeedometerGauge({
  value,
  max = 100,
  label = "Speed",
  colors = ["#06b6d4"],
  valueFormatter = (val: number) => `${val}`,
  className,
}: GaugeChartProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const gaugeData = [
    { name: "Progress", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ]

  // Generate tick marks
  const ticks = [0, 25, 50, 75, 100]

  return (
    <div className={`relative ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <Pie
            data={gaugeData}
            dataKey="value"
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={0}
            stroke="none"
          >
            <Cell fill={colors[0]} fillOpacity={0.15} stroke={colors[0]} strokeWidth={4} />
            <Cell fill="#f3f4f6" fillOpacity={0.5} stroke="#e5e7eb" strokeWidth={2} />
          </Pie>
          
          <Text
            x="50%"
            y="68%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-3xl font-bold"
            fill="#374151"
          >
            {valueFormatter(value)}
          </Text>
          <Text
            x="50%"
            y="78%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs uppercase tracking-wide"
            fill="#6b7280"
          >
            {label}
          </Text>
        </RechartsPieChart>
      </ResponsiveContainer>
      
      {/* Tick marks */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 text-xs text-gray-500">
        {ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </div>
  )
}