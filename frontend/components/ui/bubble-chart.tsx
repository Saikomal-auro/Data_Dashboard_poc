// "use client"

// import { 
//   ScatterChart, 
//   Scatter, 
//   XAxis, 
//   YAxis, 
//   ZAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer,
//   Cell,
//   Text
// } from "recharts"

// // Define data types
// interface BubbleDataItem {
//   [key: string]: string | number;
// }

// // Custom tooltip for bubble charts
// interface BubbleTooltipProps {
//   active?: boolean;
//   payload?: Array<{
//     payload: BubbleDataItem;
//   }>;
//   xKey: string;
//   yKey: string;
//   zKey: string;
//   nameKey?: string;
//   valueFormatter?: (value: number) => string;
// }

// const BubbleTooltip = ({ active, payload, xKey, yKey, zKey, nameKey, valueFormatter }: BubbleTooltipProps) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
//     return (
//       <div className="bg-white p-3 border border-gray-200 rounded-md shadow-sm text-sm">
//         {nameKey && <p className="font-semibold text-gray-800 mb-1">{data[nameKey]}</p>}
//         <p className="text-gray-600">
//           <span className="font-medium">{xKey}:</span>{" "}
//           {valueFormatter ? valueFormatter(Number(data[xKey])) : data[xKey]}
//         </p>
//         <p className="text-gray-600">
//           <span className="font-medium">{yKey}:</span>{" "}
//           {valueFormatter ? valueFormatter(Number(data[yKey])) : data[yKey]}
//         </p>
//         <p className="text-gray-600">
//           <span className="font-medium">{zKey}:</span>{" "}
//           {valueFormatter ? valueFormatter(Number(data[zKey])) : data[zKey]}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// // ============= SCATTER BUBBLE CHART =============

// interface ScatterBubbleChartProps {
//   data: BubbleDataItem[];
//   xKey: string;
//   yKey: string;
//   zKey: string; // Bubble size
//   nameKey?: string; // Label for each bubble
//   colors?: string[];
//   valueFormatter?: (value: number) => string;
//   className?: string;
//   showGrid?: boolean;
//   showLegend?: boolean;
//   xAxisLabel?: string;
//   yAxisLabel?: string;
//   minBubbleSize?: number;
//   maxBubbleSize?: number;
// }

// export function ScatterBubbleChart({
//   data,
//   xKey,
//   yKey,
//   zKey,
//   nameKey,
//   colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6", "#ef4444"],
//   valueFormatter = (value: number) => `${value}`,
//   className,
//   showGrid = true,
//   showLegend = false,
//   xAxisLabel,
//   yAxisLabel,
//   minBubbleSize = 400,
//   maxBubbleSize = 4000,
// }: ScatterBubbleChartProps) {
//   // Calculate domain for bubble sizes
//   const zValues = data.map(item => Number(item[zKey]));
//   const zMin = Math.min(...zValues);
//   const zMax = Math.max(...zValues);

//   return (
//     <ResponsiveContainer width="100%" height="100%" className={className}>
//       <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
//         {showGrid && (
//           <CartesianGrid 
//             strokeDasharray="3 3" 
//             stroke="#e5e7eb" 
//             strokeOpacity={0.5}
//           />
//         )}
        
//         <XAxis 
//           type="number" 
//           dataKey={xKey}
//           name={xAxisLabel || xKey}
//           stroke="#9ca3af"
//           tick={{ fill: '#6b7280', fontSize: 12 }}
//           label={xAxisLabel ? { 
//             value: xAxisLabel, 
//             position: 'insideBottom', 
//             offset: -10,
//             style: { fill: '#6b7280', fontSize: 12, fontWeight: 500 }
//           } : undefined}
//         />
        
//         <YAxis 
//           type="number" 
//           dataKey={yKey}
//           name={yAxisLabel || yKey}
//           stroke="#9ca3af"
//           tick={{ fill: '#6b7280', fontSize: 12 }}
//           label={yAxisLabel ? { 
//             value: yAxisLabel, 
//             angle: -90, 
//             position: 'insideLeft',
//             style: { fill: '#6b7280', fontSize: 12, fontWeight: 500 }
//           } : undefined}
//         />
        
//         <ZAxis 
//           type="number" 
//           dataKey={zKey} 
//           range={[minBubbleSize, maxBubbleSize]}
//           domain={[zMin, zMax]}
//         />
        
//         <Tooltip 
//           content={
//             <BubbleTooltip 
//               xKey={xKey} 
//               yKey={yKey} 
//               zKey={zKey}
//               nameKey={nameKey}
//               valueFormatter={valueFormatter}
//             />
//           }
//           cursor={{ strokeDasharray: '3 3' }}
//         />
        
//         {showLegend && <Legend />}
        
//         <Scatter 
//           data={data} 
//           fill="#8884d8"
//         >
//           {data.map((entry, index) => (
//             <Cell 
//               key={`cell-${index}`}
//               fill={colors[index % colors.length]}
//               fillOpacity={0.15}
//               stroke={colors[index % colors.length]}
//               strokeWidth={3}
//             />
//           ))}
//         </Scatter>
//       </ScatterChart>
//     </ResponsiveContainer>
//   );
// }

// // ============= PACKED BUBBLE CHART =============

// interface PackedBubbleChartProps {
//   data: BubbleDataItem[];
//   valueKey: string;
//   nameKey: string;
//   colors?: string[];
//   valueFormatter?: (value: number) => string;
//   className?: string;
//   showLabels?: boolean;
// }

// export function PackedBubbleChart({
//   data,
//   valueKey,
//   nameKey,
//   colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6", "#ef4444"],
//   valueFormatter = (value: number) => `${value}`,
//   className,
//   showLabels = true,
// }: PackedBubbleChartProps) {
//   // Sort data by value (largest first)
//   const sortedData = [...data].sort((a, b) => Number(b[valueKey]) - Number(a[valueKey]));
  
//   // Calculate total for percentage
//   const total = sortedData.reduce((sum, item) => sum + Number(item[valueKey]), 0);
  
//   // Simple circle packing layout
//   const packData = sortedData.map((item, index) => {
//     const value = Number(item[valueKey]);
//     const percentage = (value / total) * 100;
//     const radius = Math.sqrt(percentage) * 15; // Scale radius
    
//     return {
//       ...item,
//       radius,
//       percentage,
//       cx: 50, // Will be adjusted
//       cy: 50,
//       color: colors[index % colors.length]
//     };
//   });

//   // Simple positioning (you can enhance with force-directed layout)
//   const positioned = packData.map((item, index) => {
//     const angle = (index / packData.length) * 2 * Math.PI;
//     const distance = 30 + (index % 3) * 15;
    
//     return {
//       ...item,
//       cx: 50 + Math.cos(angle) * distance,
//       cy: 50 + Math.sin(angle) * distance,
//     };
//   });

//   return (
//     <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
//       <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
//         {positioned.map((item, index) => (
//           <g key={index}>
//             <circle
//               cx={item.cx}
//               cy={item.cy}
//               r={item.radius}
//               fill={item.color}
//               fillOpacity={0.15}
//               stroke={item.color}
//               strokeWidth={0.5}
//               className="transition-all hover:fillOpacity-25 cursor-pointer"
//             >
//               <title>
//                 {item[nameKey]}: {valueFormatter(Number(item[valueKey]))} ({item.percentage.toFixed(1)}%)
//               </title>
//             </circle>
            
//             {showLabels && item.radius > 8 && (
//               <text
//                 x={item.cx}
//                 y={item.cy}
//                 textAnchor="middle"
//                 dominantBaseline="middle"
//                 fill="#374151"
//                 fontSize="2.5"
//                 fontWeight="600"
//                 pointerEvents="none"
//               >
//                 {item[nameKey]}
//               </text>
//             )}
            
//             {showLabels && item.radius > 8 && (
//               <text
//                 x={item.cx}
//                 y={item.cy + 3}
//                 textAnchor="middle"
//                 dominantBaseline="middle"
//                 fill="#6b7280"
//                 fontSize="1.8"
//                 pointerEvents="none"
//               >
//                 {item.percentage.toFixed(0)}%
//               </text>
//             )}
//           </g>
//         ))}
//       </svg>
//     </div>
//   );
// }

// // ============= CATEGORY BUBBLE CHART =============

// interface CategoryBubbleChartProps {
//   data: BubbleDataItem[];
//   categoryKey: string;
//   valueKey: string;
//   nameKey: string;
//   colors?: string[];
//   valueFormatter?: (value: number) => string;
//   className?: string;
// }

// export function CategoryBubbleChart({
//   data,
//   categoryKey,
//   valueKey,
//   nameKey,
//   colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6"],
//   valueFormatter = (value: number) => `${value}`,
//   className,
// }: CategoryBubbleChartProps) {
//   // Group data by category
//   const categories = [...new Set(data.map(item => item[categoryKey]))];
  
//   // Create scatter data with x position based on category
//   const scatterData = data.map((item, index) => {
//     const categoryIndex = categories.indexOf(item[categoryKey]);
//     return {
//       ...item,
//       x: categoryIndex * 100 + 50,
//       y: 50 + (Math.random() - 0.5) * 40, // Random y within range
//       z: Number(item[valueKey]),
//       category: item[categoryKey],
//       color: colors[categoryIndex % colors.length]
//     };
//   });

//   return (
//     <ResponsiveContainer width="100%" height="100%" className={className}>
//       <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 30 }}>
//         <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
        
//         <XAxis 
//           type="number" 
//           dataKey="x"
//           domain={[0, categories.length * 100]}
//           ticks={categories.map((_, i) => i * 100 + 50)}
//           tickFormatter={(value) => {
//             const index = Math.round((value - 50) / 100);
//             return categories[index] || '';
//           }}
//           stroke="#9ca3af"
//           tick={{ fill: '#6b7280', fontSize: 12 }}
//         />
        
//         <YAxis 
//           type="number" 
//           dataKey="y"
//           domain={[0, 100]}
//           hide
//         />
        
//         <ZAxis 
//           type="number" 
//           dataKey="z" 
//           range={[400, 4000]}
//         />
        
//         <Tooltip 
//           content={({ active, payload }) => {
//             if (active && payload && payload.length) {
//               const data = payload[0].payload;
//               return (
//                 <div className="bg-white p-3 border border-gray-200 rounded-md shadow-sm text-sm">
//                   <p className="font-semibold text-gray-800">{data[nameKey]}</p>
//                   <p className="text-gray-600">
//                     <span className="font-medium">Category:</span> {data.category}
//                   </p>
//                   <p className="text-gray-600">
//                     <span className="font-medium">Value:</span> {valueFormatter(data.z)}
//                   </p>
//                 </div>
//               );
//             }
//             return null;
//           }}
//         />
        
//         <Scatter data={scatterData}>
//           {scatterData.map((entry, index) => (
//             <Cell 
//               key={`cell-${index}`}
//               fill={entry.color}
//               fillOpacity={0.15}
//               stroke={entry.color}
//               strokeWidth={3}
//             />
//           ))}
//         </Scatter>
//       </ScatterChart>
//     </ResponsiveContainer>
//   );
// }

// // ============= FORCE BUBBLE CHART (Network Style) =============

// interface ForceBubbleNode {
//   id: string;
//   value: number;
//   group?: string | number;
//   [key: string]: any;
// }

// interface ForceBubbleLink {
//   source: string;
//   target: string;
//   value?: number;
// }

// interface ForceBubbleChartProps {
//   nodes: ForceBubbleNode[];
//   links?: ForceBubbleLink[];
//   valueKey: string;
//   nameKey: string;
//   groupKey?: string;
//   colors?: string[];
//   valueFormatter?: (value: number) => string;
//   className?: string;
//   showLinks?: boolean;
// }

// export function ForceBubbleChart({
//   nodes,
//   links = [],
//   valueKey,
//   nameKey,
//   groupKey,
//   colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6"],
//   valueFormatter = (value: number) => `${value}`,
//   className,
//   showLinks = true,
// }: ForceBubbleChartProps) {
//   // Simple force-directed layout simulation
//   const positionedNodes = nodes.map((node, index) => {
//     const value = Number(node[valueKey]);
//     const radius = Math.sqrt(value) * 3;
    
//     // Circular layout
//     const angle = (index / nodes.length) * 2 * Math.PI;
//     const distance = 35;
    
//     const group = groupKey ? node[groupKey] : 0;
//     const colorIndex = typeof group === 'number' ? group : 0;
    
//     return {
//       ...node,
//       x: 50 + Math.cos(angle) * distance,
//       y: 50 + Math.sin(angle) * distance,
//       radius,
//       color: colors[colorIndex % colors.length]
//     };
//   });

//   return (
//     <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
//       <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
//         {/* Links */}
//         {showLinks && links.map((link, index) => {
//           const sourceNode = positionedNodes.find(n => n.id === link.source);
//           const targetNode = positionedNodes.find(n => n.id === link.target);
          
//           if (!sourceNode || !targetNode) return null;
          
//           return (
//             <line
//               key={`link-${index}`}
//               x1={sourceNode.x}
//               y1={sourceNode.y}
//               x2={targetNode.x}
//               y2={targetNode.y}
//               stroke="#d1d5db"
//               strokeWidth={0.3}
//               strokeOpacity={0.6}
//             />
//           );
//         })}
        
//         {/* Nodes */}
//         {positionedNodes.map((node, index) => (
//           <g key={index}>
//             <circle
//               cx={node.x}
//               cy={node.y}
//               r={node.radius}
//               fill={node.color}
//               fillOpacity={0.15}
//               stroke={node.color}
//               strokeWidth={0.5}
//               className="transition-all hover:fillOpacity-25 cursor-pointer"
//             >
//               <title>
//                 {node[nameKey]}: {valueFormatter(Number(node[valueKey]))}
//               </title>
//             </circle>
            
//             {node.radius > 4 && (
//               <text
//                 x={node.x}
//                 y={node.y}
//                 textAnchor="middle"
//                 dominantBaseline="middle"
//                 fill="#374151"
//                 fontSize="2"
//                 fontWeight="600"
//                 pointerEvents="none"
//               >
//                 {node[nameKey]}
//               </text>
//             )}
//           </g>
//         ))}
//       </svg>
//     </div>
//   );
// }