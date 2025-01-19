import { NextResponse } from "next/server";
import MedicalRecord from "@/models/caseModel";
import connectToDB from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectToDB(); // Ensure database connection

    // Read the body only once
    const { patientId, patientAge, patientName, assignedDoctor, organAffected, patientDescription } = await req.json();

    if (!patientId || !assignedDoctor || !organAffected || !patientDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newRecord = await MedicalRecord.create({
      patientId,
      assignedDoctor,
      organAffected,
      patientDescription,
      patientAge,
      patientName
    });

    return NextResponse.json({ success: "Case submitted successfully", record: newRecord }, { status: 201 });
  } catch (error) {
    console.error("Error submitting case:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
