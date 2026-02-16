"use client"

import {
  ResponsiveContainer,
  Tooltip,
  Treemap as RechartsTreemap,
} from "recharts"

import { CHART_COLORS } from "./chart-colors"

/* ================= TYPES ================= */

interface ChartDataItem {
  [key: string]: string | number
}

interface TreeMapProps {
  data: ChartDataItem[]
  nameKey: string
  valueKey: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

/* ================= COMPONENT ================= */

export function TreeMap({
  data,
  nameKey,
  valueKey,
  colors = [...CHART_COLORS],
  valueFormatter = (value: number) => `${value}`,
  className,
}: TreeMapProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsTreemap
        data={data}
        dataKey={valueKey}
        nameKey={nameKey}
        stroke="transparent"
        animationDuration={500}
        content={<TreeMapCell colors={colors} nameKey={nameKey} />}
      >
        <Tooltip content={<TreeMapTooltip nameKey={nameKey} valueKey={valueKey} valueFormatter={valueFormatter} />} />
      </RechartsTreemap>
    </ResponsiveContainer>
  )
}

/* ================= TOOLTIP ================= */

function TreeMapTooltip({
  active,
  payload,
  nameKey,
  valueKey,
  valueFormatter,
}: any) {
  if (!active || !payload?.length) return null

  const d = payload[0].payload
  const percent = ((d[valueKey] / d.root.value) * 100).toFixed(1)

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm px-3 py-2 text-sm">
      <p className="font-semibold text-gray-900">{d[nameKey]}</p>
      <p className="text-gray-600">
        Value: {valueFormatter(d[valueKey])}
      </p>
      <p className="text-gray-600">
        Share: {percent}%
      </p>
    </div>
  )
}

/* ================= CELL RENDERER ================= */

function TreeMapCell(props: any) {
  const {
    x,
    y,
    width,
    height,
    index,
    colors,
    nameKey,
  } = props

  const color = colors[index % colors.length]
  
  // Access the name from props
  const name = props[nameKey] || props.name || ''

  // Helper function to truncate text based on available space
  const getTruncatedText = (text: string, maxChars: number) => {
    if (text.length <= maxChars || maxChars < 4) return text.substring(0, maxChars)
    return text.substring(0, maxChars - 3) + '...'
  }

  // Determine if cell is narrow (should rotate text)
  const isNarrow = width < height && width < 100
  
  // Smart font sizing based on cell dimensions
  let fontSize = 14
  if (width < 70 || height < 45) fontSize = 9
  else if (width < 100 || height < 60) fontSize = 10
  else if (width < 130 || height < 70) fontSize = 11
  else if (width < 160) fontSize = 12
  else if (width < 200) fontSize = 13

  // For narrow cells, use the height as available space (since rotated)
  // For wide cells, use the width
  const availableSpace = isNarrow ? height : width
  const pixelsPerChar = fontSize * 0.6
  const maxChars = Math.floor((availableSpace - 16) / pixelsPerChar)
  const truncatedName = getTruncatedText(name, maxChars)

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        fillOpacity={1}
      />

      {isNarrow ? (
        // Vertical text for narrow cells (reads bottom-to-top like book spine)
        <text
          x={x + width / 2}
          y={y + 8}
          fill="white"
          fontSize={fontSize}
          fontWeight={600}
          textAnchor="start"
          dominantBaseline="middle"
          pointerEvents="none"
          transform={`rotate(90, ${x + width / 2}, ${y + 8})`}
        >
          {truncatedName}
        </text>
      ) : (
        // Horizontal text for normal cells
        <text
          x={x + 8}
          y={y + height / 2}
          fill="white"
          fontSize={fontSize}
          fontWeight={600}
          dominantBaseline="middle"
          pointerEvents="none"
        >
          {truncatedName}
        </text>
      )}
    </g>
  )
}