/* eslint-disable */

"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Doctor = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experienceYears: number;
  isActive: boolean;
};

export const columns: ColumnDef<Doctor>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "specialization", header: "Specialization" },
  { accessorKey: "experienceYears", header: "Experience (Years)" },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }:{row:any}) => (
      <span className={row.original.isActive ? "text-green-600" : "text-red-600"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
];
