"use client";

import { useState } from "react";
import { ColumnDef, SortingState, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
};

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), state: { sorting }, onSortingChange: setSorting });

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y ">
        <thead className="">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-3 text-left text-xs font-medium uppercase">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 text-sm ">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
