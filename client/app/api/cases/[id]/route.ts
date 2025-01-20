import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Case from "@/models/caseModel";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params to extract the id

  try {
    await connectToDB(); // Ensure DB is connected

    if (!id) {
      return NextResponse.json({ message: "Case ID is required" }, { status: 400 });
    }

    const caseData = await Case.findById(id)
      .populate("assignedDoctor", "name")
      .lean();

    if (!caseData) {
      return NextResponse.json({ message: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: caseData._id.toString(),
      patientName: caseData.patientName,
      patientAge: caseData.patientAge,
      assignedDoctor: caseData.assignedDoctor?.name || "Unknown",
      organAffected: caseData.organAffected,
      patientDescription: caseData.patientDescription,
    });
  } catch (error) {
    console.error("Error fetching case:", error);
    return NextResponse.json({ message: "Failed to fetch case" }, { status: 500 });
  }
}
