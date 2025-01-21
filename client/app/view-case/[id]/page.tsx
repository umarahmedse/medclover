/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import MultiOrganSelector from "@/components/MultipleOrganSelector";
import axios from "axios";
import { MedicalCaseStatus } from "@/components/medical-case-status";
import { Spinner } from "@/components/ui/spinner";  // Import the spinner component

export default function CaseView() {
  const { id } = useParams(); // Get case ID from URL
  const [caseData, setCaseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchCase = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`/api/cases/${id}`);
        setCaseData(response.data);
      } catch (err) {
        console.error("Error fetching case:", err);
        setError("Failed to load case data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner /> {/* Spinner shown while loading */}
      </div>
    );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Case Details</h1>
        <MedicalCaseStatus isClosed={caseData.isClosed} caseId={caseData._id.slice(-5).toUpperCase()} />
      </div>
      {!loading && caseData && (
        <div className="grid w-full items-center gap-4 p-4">
          <div className="flex flex-col gap-3">
            <div className="md:max-w-[50%]">
              <Label>Patient Name</Label>
              <p className="border p-2 rounded-md hover:cursor-not-allowed">{caseData.patientName}</p>
            </div>

            <div className="md:max-w-[50%]">
              <Label>Age</Label>
              <p className="border p-2 rounded-md hover:cursor-not-allowed">{caseData.patientAge}</p>
            </div>

            <div>
              <MultiOrganSelector
                selectedOrgans={caseData.organAffected}
                onOrganChange={() => {}}
              />
            </div>
            <div className="md:max-w-[50%]">
              <Label>Doctor :</Label>
              <p className="border p-2 rounded-md hover:cursor-not-allowed">{caseData.assignedDoctor || "Un-assigned yet"}</p>
            </div>

            <div>
              <Label>Self Description</Label>
              <textarea
                rows={8}
                className="border p-2 rounded-md hover:cursor-not-allowed whitespace-pre-wrap w-full"
                defaultValue={caseData.patientDescription}
                readOnly
              ></textarea>
            </div>
            <div>
              <Label>Enhanced Description</Label>
              <textarea
                rows={8}
                className="border p-2 rounded-md hover:cursor-not-allowed whitespace-pre-wrap w-full"
                defaultValue={caseData.enhancedDescription}
              ></textarea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
