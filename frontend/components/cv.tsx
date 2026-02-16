"use client";

import React from "react";

// ✅ Import YOUR chart wrappers (not Recharts directly)
import { AreaChart } from "./ui/area-chart";
import { BarChart } from "./ui/bar-chart";
import { PieChart, DonutChart } from "./ui/pie-chart";
import { ScatterChart } from "./ui/scatter-chart";
import { LineChart } from "./ui/line-chart";
import { TreeMap } from "./ui/tree-map";
import { ComboChart } from "./ui/combo-chart";

type ScaleType = "auto" | "fromZero" | "percentage" | "custom";

interface ChartVisualizationProps {
  chartType:
    | "line"
    | "area"
    | "stacked-area"
    | "bar"
    | "horizontal-bar"
    | "grouped-bar"
    | "stacked-bar"
    | "pie"
    | "donut"
    | "scatter"
    | "treemap"
    | "funnel"
    | "bar-line"
    | "stacked-bar-line";

  title?: string;
  data: any[];

  // Common keys
  xKey?: string;
  yKey?: string;
  yKeys?: string[];
  valueKey?: string;
  nameKey?: string;
  labelKey?: string;

  // Optional controls
  orientation?: "horizontal" | "vertical";
  showTitle?: boolean;

  // ✅ NEW: Scaling options
  scaleType?: ScaleType;
  xScaleType?: ScaleType;
  yScaleType?: ScaleType;
  xDomain?: [number | string, number | string];
  yDomain?: [number | string, number | string];
  paddingPercent?: number;
  xPaddingPercent?: number;
  yPaddingPercent?: number;
}

export default function ChartVisualization({
  chartType,
  title,
  data,
  xKey,
  yKey,
  yKeys,
  valueKey,
  nameKey,
  labelKey,
  orientation = "vertical",
  showTitle = true,
  
  // ✅ NEW: Scaling props with sensible defaults
  scaleType = "fromZero",
  xScaleType = "auto",
  yScaleType = "auto",
  xDomain,
  yDomain,
  paddingPercent = 10,
  xPaddingPercent = 5,
  yPaddingPercent = 5,
}: ChartVisualizationProps) {
  const renderChart = () => {
    // Handle empty data
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-sm text-gray-500">
          No data available
        </div>
      );
    }

    switch (chartType) {
      /* ================= AREA / LINE ================= */
      case "area":
        return (
          <AreaChart
            data={data}
            index={xKey!}
            categories={yKeys ?? [yKey!]}
            showLegend={(yKeys?.length ?? 1) > 1}
            showGrid
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            xDomain={xDomain}
            yDomain={yDomain}
            xPaddingPercent={xPaddingPercent}
            yPaddingPercent={yPaddingPercent}
          />
        );

      case "stacked-area":
        return (
          <AreaChart
            data={data}
            index={xKey!}
            categories={yKeys ?? [yKey!]}
            showLegend={(yKeys?.length ?? 1) > 1}
            showGrid
            stack={true}
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            xDomain={xDomain}
            yDomain={yDomain}
            xPaddingPercent={xPaddingPercent}
            yPaddingPercent={yPaddingPercent}
          />
        );

      /* ================= LINE ================= */
      case "line":
        return (
          <LineChart
            data={data}
            index={xKey!}
            categories={yKeys ?? [yKey!]}
            showLegend={(yKeys?.length ?? 1) > 1}
            showGrid
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            xDomain={xDomain}
            yDomain={yDomain}
            xPaddingPercent={xPaddingPercent}
            yPaddingPercent={yPaddingPercent}
          />
        );

      /* ================= BAR ================= */
      case "bar":
        return (
          <BarChart
            data={data}
            index={xKey!}
            categories={yKeys ?? [yKey!]}
            orientation="vertical"
            variant="single"
            showLegend={false}
            showGrid
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            xDomain={xDomain}
            yDomain={yDomain}
            xPaddingPercent={xPaddingPercent}
            yPaddingPercent={yPaddingPercent}
          />
        );

      case "horizontal-bar":
        return (
          <BarChart
            data={data}
            index={xKey || nameKey!}
            categories={yKeys ?? [yKey || valueKey!]}
            orientation="horizontal"
            variant="single"
            showLegend={false}
            showGrid
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            xDomain={xDomain}
            yDomain={yDomain}
            xPaddingPercent={xPaddingPercent}
            yPaddingPercent={yPaddingPercent}
          />
        );

      case "grouped-bar":
        return (
          <BarChart
            data={data}
            index={xKey!}
            categories={yKeys!}
            orientation="vertical"
            variant="grouped"
            showLegend={true}
            showGrid
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            xDomain={xDomain}
            yDomain={yDomain}
            xPaddingPercent={xPaddingPercent}
            yPaddingPercent={yPaddingPercent}
          />
        );

      case "stacked-bar":
        return (
          <BarChart
            data={data}
            index={xKey!}
            categories={yKeys!}
            orientation="vertical"
            variant="stacked"
            showLegend={true}
            showGrid
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            xDomain={xDomain}
            yDomain={yDomain}
            xPaddingPercent={xPaddingPercent}
            yPaddingPercent={yPaddingPercent}
          />
        );

      /* ================= PIE ================= */
      case "pie":
        return (
          <PieChart
            data={data}
            index={nameKey || xKey!}
            category={valueKey || yKey!}
            showLegend
          />
        );

      /* ================= DONUT ================= */
      case "donut":
        return (
          <DonutChart
            data={data}
            index={nameKey || xKey!}
            category={valueKey || yKey!}
            showLegend
            centerText="Total"
          />
        );

      /* ================= SCATTER ================= */
      case "scatter":
        return (
          <ScatterChart
            data={data}
            xKey={xKey!}
            yKey={yKey!}
            labelKey={labelKey || nameKey || "name"}
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            xDomain={xDomain}
            yDomain={yDomain}
            xPaddingPercent={xPaddingPercent}
            yPaddingPercent={yPaddingPercent}
          />
        );

      /* ================= TREEMAP ================= */
      case "treemap":
        return (
          <TreeMap
            data={data}
            nameKey={nameKey || xKey!}
            valueKey={valueKey || yKey!}
          />
        );

      /* ================= FUNNEL ================= */
      case "funnel":
        return (
          <div className="flex flex-col gap-2.5 py-0 px-2">
            {data.map((stage, idx) => {
              const maxCount = data[0]?.count || 1;
              const widthPercent = ((stage.count || 0) / maxCount) * 100;
              const colors = [
                "#3b82f6",
                "#6366f1",
                "#8b5cf6",
                "#a855f7",
                "#c026d3",
                "#d946ef",
              ];

              return (
                <div key={idx} className="flex items-center gap-3 w-full">
                  <div className="w-32 text-xs font-medium text-gray-700 text-right flex-shrink-0">
                    {stage.stage}
                  </div>
                  <div className="flex-1 flex items-center">
                    <div
                      className="rounded-r-lg h-9 flex items-center justify-between px-3 transition-all duration-300 shadow-sm"
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor: colors[idx % colors.length],
                        minWidth: '80px',
                      }}
                    >
                      <span className="text-white font-semibold text-sm">
                        {stage.count?.toLocaleString()}
                      </span>
                      <span className="text-white text-xs font-medium">
                        {stage.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      /* ================= COMBOS ================= */
      case "bar-line":
        return (
          <ComboChart
            data={data}
            index={xKey!}
            barCategories={yKeys ? [yKeys[0]] : [yKey!]}
            lineCategories={yKeys ? yKeys.slice(1) : []}
            showLegend={true}
            showGrid
            scaleType={scaleType}
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            yAxisDomain={yDomain}
            xDomain={xDomain}
            paddingPercent={paddingPercent}
            xPaddingPercent={xPaddingPercent}
            yPaddingPercent={yPaddingPercent}
          />
        );

      case "stacked-bar-line":
        return (
          <ComboChart
            data={data}
            index={xKey!}
            barCategories={yKeys?.slice(0, 2) ?? [yKey!]}
            lineCategories={yKeys?.slice(2) ?? []}
            stackBars={true}
            showLegend={true}
            showGrid
            scaleType={scaleType}
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            yAxisDomain={yDomain}
            xDomain={xDomain}
            paddingPercent={paddingPercent}
            xPaddingPercent={xPaddingPercent}
            yPaddingPercent={yPaddingPercent}
          />
        );

      /* ================= FALLBACK ================= */
      default:
        return (
          <div className="text-sm text-gray-500">
            Unsupported chart type: {chartType}
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      {showTitle && title && (
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>📊</span>
          {title}
        </h3>
      )}

      {/* Fixed height ensures Recharts renders correctly */}
      <div className="h-[250px] w-full">
        {renderChart()}
      </div>
    </div>
  );
}