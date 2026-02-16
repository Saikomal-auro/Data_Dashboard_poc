// "use client"

// import React from "react"

// // Define data types
// interface HeatmapDataItem {
//   [key: string]: string | number;
// }

// interface HeatmapCell {
//   row: string | number;
//   column: string | number;
//   value: number;
//   label?: string;
// }

// // ============= MATRIX HEATMAP TABLE =============

// interface MatrixHeatmapProps {
//   data: HeatmapDataItem[];
//   rowKey: string;
//   columnKey: string;
//   valueKey: string;
//   colors?: [string, string]; // [minColor, maxColor] gradient
//   valueFormatter?: (value: number) => string;
//   className?: string;
//   showValues?: boolean;
//   showRowLabels?: boolean;
//   showColumnLabels?: boolean;
//   cellSize?: number;
//   title?: string;
// }

// export function MatrixHeatmap({
//   data,
//   rowKey,
//   columnKey,
//   valueKey,
//   colors = ["#dbeafe", "#3b82f6"], // Match your color palette
//   valueFormatter = (value: number) => `${value}`,
//   className,
//   showValues = true,
//   showRowLabels = true,
//   showColumnLabels = true,
//   cellSize = 60,
//   title,
// }: MatrixHeatmapProps) {
//   // Extract unique rows and columns
//   const rows = [...new Set(data.map(item => item[rowKey]))].sort();
//   const columns = [...new Set(data.map(item => item[columnKey]))].sort();
  
//   // Find min and max values for color scaling
//   const values = data.map(item => Number(item[valueKey]));
//   const minValue = Math.min(...values);
//   const maxValue = Math.max(...values);
  
//   // Helper function to get opacity based on value - MATCHING YOUR STYLE
//   const getOpacity = (value: number) => {
//     const ratio = (value - minValue) / (maxValue - minValue);
//     return 0.1 + (ratio * 0.8); // 0.1 to 0.9 range (matching your fillOpacity: 0.1)
//   };
  
//   // Get value for specific row/column
//   const getValue = (row: any, col: any) => {
//     const cell = data.find(
//       item => item[rowKey] === row && item[columnKey] === col
//     );
//     return cell ? Number(cell[valueKey]) : null;
//   };

//   return (
//     <div className={`${className}`}>
//       {title && (
//         <div className="mb-4">
//           <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//         </div>
//       )}
      
//       <div className="overflow-x-auto">
//         <div className="inline-block min-w-full">
//           {/* Table */}
//           <div className="border border-gray-200 rounded-lg overflow-hidden">
//             {/* Header Row */}
//             {showColumnLabels && (
//               <div className="flex bg-gray-50">
//                 {showRowLabels && (
//                   <div 
//                     className="flex-shrink-0 border-r border-gray-200 bg-white"
//                     style={{ width: cellSize * 1.5 }}
//                   />
//                 )}
//                 {columns.map((col, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center justify-center border-r border-gray-200 last:border-r-0 p-2"
//                     style={{ width: cellSize, minWidth: cellSize }}
//                   >
//                     <span className="text-xs font-medium text-gray-600 truncate">
//                       {col}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
            
//             {/* Data Rows */}
//             {rows.map((row, rowIdx) => (
//               <div key={rowIdx} className="flex border-t border-gray-200">
//                 {/* Row Label */}
//                 {showRowLabels && (
//                   <div
//                     className="flex-shrink-0 flex items-center justify-end px-3 border-r border-gray-200 bg-gray-50"
//                     style={{ width: cellSize * 1.5 }}
//                   >
//                     <span className="text-xs font-medium text-gray-600 truncate">
//                       {row}
//                     </span>
//                   </div>
//                 )}
                
//                 {/* Data Cells */}
//                 {columns.map((col, colIdx) => {
//                   const value = getValue(row, col);
                  
//                   if (value === null) {
//                     return (
//                       <div
//                         key={colIdx}
//                         className="border-r border-gray-200 last:border-r-0 bg-gray-50"
//                         style={{ width: cellSize, height: cellSize, minWidth: cellSize }}
//                       />
//                     );
//                   }
                  
//                   return (
//                     <div
//                       key={colIdx}
//                       className="relative border-r border-gray-200 last:border-r-0 group cursor-pointer transition-all hover:ring-2 hover:ring-blue-400 hover:z-10"
//                       style={{ 
//                         width: cellSize, 
//                         height: cellSize,
//                         minWidth: cellSize,
//                       }}
//                     >
//                       {/* Background with opacity - MATCHING strokeWidth={2} style */}
//                       <div
//                         className="absolute inset-0"
//                         style={{
//                           backgroundColor: colors[1],
//                           opacity: getOpacity(value),
//                         }}
//                       />
                      
//                       {/* Border stroke - MATCHING your strokeWidth={2} */}
//                       <div
//                         className="absolute inset-0"
//                         style={{
//                           border: `2px solid ${colors[1]}`,
//                           opacity: 0.4,
//                         }}
//                       />
                      
//                       {/* Value */}
//                       {showValues && (
//                         <div className="absolute inset-0 flex items-center justify-center">
//                           <span className="text-xs font-semibold text-gray-800 relative z-10">
//                             {valueFormatter(value)}
//                           </span>
//                         </div>
//                       )}
                      
//                       {/* Tooltip - MATCHING your tooltip style */}
//                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
//                         <div className="bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200 text-sm">
//                           <p className="font-medium text-gray-700">
//                             {row} × {col}
//                           </p>
//                           <p className="text-gray-600">
//                             {valueFormatter(value)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
          
//           {/* Legend */}
//           <div className="mt-4 flex items-center justify-center gap-2">
//             <span className="text-xs text-gray-600">Low</span>
//             <div className="flex h-4 w-48 rounded overflow-hidden border border-gray-200">
//               {[...Array(10)].map((_, idx) => (
//                 <div
//                   key={idx}
//                   className="flex-1"
//                   style={{
//                     backgroundColor: colors[1],
//                     opacity: 0.1 + (idx / 10) * 0.8, // Matching your 0.1 base opacity
//                   }}
//                 />
//               ))}
//             </div>
//             <span className="text-xs text-gray-600">High</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ============= CALENDAR HEATMAP (GitHub Style) =============

// interface CalendarHeatmapProps {
//   data: Array<{
//     date: string; // Format: "YYYY-MM-DD"
//     value: number;
//   }>;
//   colors?: [string, string];
//   valueFormatter?: (value: number) => string;
//   className?: string;
//   year?: number;
//   cellSize?: number;
//   cellGap?: number;
// }

// export function CalendarHeatmap({
//   data,
//   colors = ["#dbeafe", "#3b82f6"], // Matching your palette
//   valueFormatter = (value: number) => `${value}`,
//   className,
//   year = new Date().getFullYear(),
//   cellSize = 12,
//   cellGap = 3,
// }: CalendarHeatmapProps) {
//   // Find min/max values
//   const values = data.map(d => d.value);
//   const minValue = Math.min(...values);
//   const maxValue = Math.max(...values);
  
//   // Get opacity based on value - MATCHING YOUR STYLE
//   const getOpacity = (value: number) => {
//     if (maxValue === minValue) return 0.5;
//     const ratio = (value - minValue) / (maxValue - minValue);
//     return 0.1 + (ratio * 0.8); // Base 0.1 like your bars
//   };
  
//   // Get value for specific date
//   const getValueForDate = (date: Date) => {
//     const dateStr = date.toISOString().split('T')[0];
//     const item = data.find(d => d.date === dateStr);
//     return item ? item.value : null;
//   };
  
//   // Generate weeks for the year
//   const weeks: Date[][] = [];
//   const startDate = new Date(year, 0, 1);
//   const endDate = new Date(year, 11, 31);
  
//   // Adjust to start on Sunday
//   const firstDay = new Date(startDate);
//   firstDay.setDate(firstDay.getDate() - firstDay.getDay());
  
//   let currentDate = new Date(firstDay);
  
//   while (currentDate <= endDate) {
//     const week: Date[] = [];
//     for (let i = 0; i < 7; i++) {
//       week.push(new Date(currentDate));
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
//     weeks.push(week);
//   }
  
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//   return (
//     <div className={`${className}`}>
//       <div className="overflow-x-auto">
//         <div className="inline-block">
//           {/* Month labels */}
//           <div className="flex mb-2" style={{ marginLeft: cellSize + cellGap + 20 }}>
//             {months.map((month, idx) => (
//               <div
//                 key={idx}
//                 className="text-xs text-gray-600"
//                 style={{ 
//                   width: (cellSize + cellGap) * 4.33,
//                 }}
//               >
//                 {month}
//               </div>
//             ))}
//           </div>
          
//           <div className="flex">
//             {/* Day labels */}
//             <div className="flex flex-col justify-around mr-2" style={{ width: 20 }}>
//               {days.filter((_, idx) => idx % 2 === 1).map((day, idx) => (
//                 <div key={idx} className="text-xs text-gray-600 h-3 flex items-center">
//                   {day}
//                 </div>
//               ))}
//             </div>
            
//             {/* Calendar grid */}
//             <div className="flex gap-1">
//               {weeks.map((weekweekIdx) => (
//                 <div key={weekIdx} className="flex flex-col" style={{ gap: cellGap }}>
//                   {week.map((date, dayIdx) => {
//                     const value = getValueForDate(date);
//                     const isCurrentYear = date.getFullYear() === year;
                    
//                     if (!isCurrentYear) {
//                       return (
//                         <div
//                           key={dayIdx}
//                           style={{ 
//                             width: cellSize, 
//                             height: cellSize,
//                           }}
//                         />
//                       );
//                     }
                    
//                     return (
//                       <div
//                         key={dayIdx}
//                         className="relative group cursor-pointer rounded-sm transition-all hover:ring-2 hover:ring-blue-400"
//                         style={{ 
//                           width: cellSize, 
//                           height: cellSize,
//                           backgroundColor: value !== null ? colors[1] : '#f3f4f6',
//                           opacity: value !== null ? getOpacity(value) : 0.3,
//                           border: `2px solid ${value !== null ? colors[1] : '#e5e7eb'}`, // strokeWidth={2}
//                         }}
//                       >
//                         {/* Tooltip - MATCHING your style */}
//                         {value !== null && (
//                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
//                             <div className="bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200 text-sm">
//                               <p className="font-medium text-gray-700">
//                                 {date.toLocaleDateString()}
//                               </p>
//                               <p className="text-gray-600">
//                                 {valueFormatter(value)}
//                               </p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {/* Legend */}
//           <div className="mt-4 flex items-center justify-end gap-2">
//             <span className="text-xs text-gray-600">Less</span>
//             <div className="flex gap-1">
//               {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
//                 <div
//                   key={idx}
//                   className="rounded-sm"
//                   style={{
//                     width: cellSize,
//                     height: cellSize,
//                     backgroundColor: colors[1],
//                     opacity: 0.1 + (ratio * 0.8), // Base 0.1
//                     border: `2px solid ${colors[1]}`,
//                   }}
//                 />
//               ))}
//             </div>
//             <span className="text-xs text-gray-600">More</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }