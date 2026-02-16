"use client";

import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableVisualizationProps {
  title?: string;
  headers: string[];
  rows: any[];
  showTitle?: boolean;
  enableScrolling?: boolean;
}

export default function TableVisualization({
  title,
  headers,
  rows,
  showTitle = true,
  enableScrolling = false,
}: TableVisualizationProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterColumn, setFilterColumn] = useState<string>("all");

  /* ---------------- HELPERS ---------------- */

  const getCellValue = (row: any, header: string) => {
    const key = Object.keys(row).find(
      (k) => k.toLowerCase() === header.toLowerCase()
    );
    return key ? row[key] : "";
  };

  const filteredRows =
    rows?.filter((row) => {
      if (!searchTerm) return true;

      if (filterColumn === "all") {
        return headers.some((header) =>
          String(getCellValue(row, header))
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      }

      return String(getCellValue(row, filterColumn))
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }) ?? [];

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 space-y-4">

      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col gap-3">

        {showTitle && (
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        )}

        <div className="flex flex-col sm:flex-row gap-2">

          {/* Search */}
          <Input
            placeholder={
              filterColumn === "all"
                ? "Search all columns..."
                : `Search ${filterColumn}...`
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-0"
          />

          {/* Column Filter */}
          <Select
            value={filterColumn}
            onValueChange={setFilterColumn}
          >
            <SelectTrigger className="w-full sm:w-44 flex-shrink-0">
              <SelectValue placeholder="Filter column" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All columns</SelectItem>
              {headers.map((header) => (
                <SelectItem key={header} value={header}>
                  {header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div
        className={`rounded-md border ${
          enableScrolling ? "max-h-[260px] overflow-auto" : "overflow-x-auto"
        }`}
      >
        <Table>

          <TableHeader className="sticky top-0 bg-muted">
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={header}>
                      {getCellValue(row, header)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="text-center text-muted-foreground py-6"
                >
                  {searchTerm
                    ? `No results for "${searchTerm}"`
                    : "No data available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>

      {/* ---------- FOOTER ---------- */}
      {searchTerm && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredRows.length} of {rows.length} rows
          {filterColumn !== "all" && ` in "${filterColumn}"`}
        </p>
      )}

    </div>
  );
}