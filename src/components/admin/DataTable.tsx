"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  emptyAction?: React.ReactNode;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  onRowClick,
  pagination,
  emptyAction,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-[#242424] bg-[#1A1A1A] overflow-hidden">
        <Table className="border-collapse w-full">
          <TableHeader className="bg-[#141414] hover:bg-[#141414]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-[#242424] hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="h-10 text-[11px] font-mono text-[#6B6B6B] uppercase tracking-widest px-4 text-left align-middle"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton rows (10 rows)
              Array.from({ length: 10 }).map((_, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="border-b border-[#242424] bg-[#141414] even:bg-[#161616]"
                >
                  {columns.map((_, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className="p-4 align-middle h-14"
                    >
                      <div className="h-4 bg-[#242424] rounded-md animate-pulse w-full max-w-[120px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    "border-b border-[#242424] bg-[#141414] even:bg-[#161616] hover:bg-[#1E1A14] transition-colors cursor-pointer",
                    onRowClick ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-4 align-middle text-sm text-[#F5F5F5] font-sans"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center p-4 align-middle"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm text-[#6B6B6B] font-sans">
                      No data found.
                    </p>
                    {emptyAction && <div className="mt-1">{emptyAction}</div>}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-[12px] font-mono text-[#6B6B6B]">
            Showing page {pagination.page} of {pagination.totalPages || 1}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={pagination.page <= 1 || isLoading}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="border-[#2A2A2A] bg-transparent text-[#C9933A] hover:bg-[#C9933A] hover:text-[#0F0F0F] rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={pagination.page >= pagination.totalPages || isLoading}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="border-[#2A2A2A] bg-transparent text-[#C9933A] hover:bg-[#C9933A] hover:text-[#0F0F0F] rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
