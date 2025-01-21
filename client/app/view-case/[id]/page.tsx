/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import MultiOrganSelector from "@/components/MultipleOrganSelector";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { MedicalCaseStatus } from "@/components/medical-case-status";

export default function CaseView() {
  const { id } = useParams(); // Get case ID from URL
  const [caseData, setCaseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0); // ✅ Real progress state

  useEffect(() => {
    if (!id) return;

    const fetchCase = async () => {
      try {
        setLoading(true);
        setProgress(0); // Start at 10%

        const response = await axios.get(`/api/cases/${id}`, {
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percent); // ✅ Update based on real download progress
            }
          },
        });

        setCaseData(response.data);
        console.log(response.data)
      } catch (err) {
        console.error("Error fetching case:", err);
        setError("Failed to load case data.");
      } finally {
        setLoading(false);
        setProgress(100); // Ensure it completes
        setTimeout(() => setProgress(0), 500); // Reset after a brief delay
      }
    };

    fetchCase();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Progress value={progress} className="w-[500px]" />
      </div>
    );
  return (
    <div className="p-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Case Details</h1>
      <MedicalCaseStatus isClosed={caseData.isClosed} caseId={caseData._id.slice(-5).toUpperCase()} />      </div>
      {/* ✅ Show case details only after loading is complete */}
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
