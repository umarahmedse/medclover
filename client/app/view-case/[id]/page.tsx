/* eslint-disable*/

import { Label } from "@/components/ui/label";
import MultiOrganSelector from "@/components/MultipleOrganSelector";
import connectToDB  from "@/lib/mongodb";
import Case from "@/models/caseModel";

async function CaseView({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await connectToDB();
    const caseData = await Case.findById(id)
      .populate("assignedDoctor", "name")
      .lean();

    // Check if caseData is null or an array, and handle the case
    if (!caseData || Array.isArray(caseData)) {
      return <p className="text-red-500">Case not found</p>;
    }

    // Destructure fields safely
    const { patientName, patientAge, assignedDoctor, organAffected, patientDescription } = caseData as any;

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Case Details</h1>

        <div className="grid w-full items-center gap-4 p-4">
          <div className="flex flex-col gap-3">
            <div className="md:max-w-[50%]">
              <Label>Patient Name</Label>
              <p className="border p-2 rounded-md">{patientName}</p>
            </div>

            <div className="md:max-w-[50%]">
              <Label>Age</Label>
              <p className="border p-2 rounded-md">{patientAge}</p>
            </div>

            <div>
              <Label>Selected Organs</Label>
              <MultiOrganSelector selectedOrgans={organAffected} onOrganChange={() => {}} />
            </div>

            <div className="flex items-center gap-2">
              <Label>Assigned Doctor: </Label>
              <Label>{assignedDoctor?.name || "Un-assigned yet"}</Label>
            </div>

            <div>
              <Label>Self Description</Label>
              <textarea rows={8} className="border p-2 rounded-md whitespace-pre-wrap w-full" defaultValue={patientDescription}></textarea>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching case:", error);
    return <p className="text-red-500">Failed to load case data</p>;
  }
}

export default CaseView;
