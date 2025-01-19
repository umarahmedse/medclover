/* eslint-disable */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "./table-skeleton";
import Link from "next/link";
import { useSession } from "@clerk/nextjs";
interface Case {
  _id: string;
  patientName: string;
  assignedDoctor: string;
  organAffected: string[];
  isClosed: boolean;
}

export function TableCasesDetailed() {
  const { session } = useSession();
  const userId = session?.user.publicMetadata.user_id;

  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return; // Avoid making requests if userId is not available

    const fetchCases = async () => {
      try {
        const response = await axios.get(`/api/cases?userId=${userId}`);
        setCases(response.data);
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, [userId]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  return cases.length > 0 ? (
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
            <TableCell className="font-medium">
              {caseItem._id.slice(-5).toUpperCase()}
            </TableCell>
            <TableCell>{caseItem.patientName}</TableCell>
            <TableCell>
              {caseItem.organAffected
                .map((organ) => organ.charAt(0).toUpperCase() + organ.slice(1))
                .join(", ")}
            </TableCell>
            <TableCell>{caseItem.assignedDoctor}</TableCell>
            <TableCell className="flex items-center justify-center">
              <Link
                href={`/view-case/${caseItem._id}`}
                className={`text-center w-fit ml-auto px-2 py-1 rounded-lg dark:bg-blue-500 dark:text-white bg-green-500 text-black`}
              >
                View Case
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div className="!w-full flex flex-col gap-2 items-center justify-center">
      <h1>No Previous Cases 🙅‍♂️</h1>
      <h3>Want To Add One? ➕</h3>
      <Link
        href="/addcase"
        className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black"
      >
        Add Case
      </Link>
    </div>
  );
}
