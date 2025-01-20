/* eslint-disable*/

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import MultiOrganSelector from "@/components/MultipleOrganSelector";
import axios from "axios";

export default function CaseView() {
  const { id } = useParams(); // Get case ID from URL
  const [caseData, setCaseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCase = async () => {
      try {
        const response = await axios.get(`/api/cases/${id}`);
        setCaseData(response.data);
      } catch (err) {
        console.error("Error fetching case:", err);
        setError("Failed to load case data.");
      }
    };

    fetchCase();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!caseData) return null; 

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Case Details</h1>

      <div className="grid w-full items-center gap-4 p-4">
        <div className="flex flex-col gap-3">
          <div className="md:max-w-[50%]">
            <Label>Patient Name</Label>
            <p className="border p-2 rounded-md">{caseData.patientName}</p>
          </div>

          <div className="md:max-w-[50%]">
            <Label>Age</Label>
            <p className="border p-2 rounded-md">{caseData.patientAge}</p>
          </div>

          <div>
            <Label>Selected Organs</Label>
            <MultiOrganSelector selectedOrgans={caseData.organAffected} onOrganChange={() => {}} />
          </div>

          <div className="flex items-center gap-2">
            <Label>Assigned Doctor : </Label>
            <Label>{caseData.assignedDoctor || "Un-assigned yet"}</Label>

          </div>

          <div>
            <Label>Self Description</Label>
            <textarea rows={8} className="border p-2 rounded-md whitespace-pre-wrap w-full" defaultValue={caseData.patientDescription}></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
