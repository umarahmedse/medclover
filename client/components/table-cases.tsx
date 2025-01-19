/* eslint-disable no-use-before-define */
"use client"
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton } from "./table-skeleton";

interface Case {
  _id: string;
  patientName: string;
  assignedDoctor: string;
  organAffected: string[];
  isClosed: boolean;
}

export function TableCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch("/api/cases");
        const data = await response.json();
        setCases(data);
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <Table>
      <TableCaption>Previous Cases By Date</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Case Code</TableHead>
          <TableHead className="w-[150px]">Patient Name</TableHead>

          <TableHead>Affected Organs</TableHead>
          <TableHead>Assigned Doctor</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.map((caseItem) => (
          <TableRow key={caseItem._id}>
            <TableCell className="font-medium">{caseItem._id.toString().slice(-5).toUpperCase()}</TableCell>
            <TableCell>{caseItem.patientName}</TableCell>

            <TableCell>
  {caseItem.organAffected
    .map((organ) => organ.charAt(0).toUpperCase() + organ.slice(1))  
    .join(", ")}
</TableCell>            <TableCell>{caseItem.assignedDoctor}</TableCell>
            <TableCell
             
            >
              <p  className={`text-center w-fit ml-auto px-2 py-1 rounded-full ${
                caseItem.isClosed
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}>
              {caseItem.isClosed ? "Closed" : "Open"}</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
     
    </Table>
  );
}
