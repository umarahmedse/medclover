import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Case from "@/models/caseModel";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await connectToDB();

    if (!id) {
      return NextResponse.json({ message: "Case ID is required" }, { status: 400 });
    }

    const caseData = await Case.findById(id)
      .populate("assignedDoctor", "name")
      .lean();

    if (!caseData) {
      return NextResponse.json({ message: "Case not found" }, { status: 404 });
    }

    // Ensure caseData is not an array, and handle the case if it's null
    const { _id, patientName, patientAge, assignedDoctor, organAffected, patientDescription } = caseData as any;

    return NextResponse.json({
      _id: _id.toString(),
      patientName,
      patientAge,
      assignedDoctor: assignedDoctor?.name || "Unknown",
      organAffected,
      patientDescription,
    });
  } catch (error) {
    console.error("Error fetching case:", error);
    return NextResponse.json({ message: "Failed to fetch case" }, { status: 500 });
  }
}
