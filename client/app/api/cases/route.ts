/* eslint-disable*/
import { NextResponse } from "next/server";
import MedicalRecord from "@/models/caseModel";
import connectToDB from "@/lib/mongodb";
import Case from "@/models/caseModel";  // Assuming you have a case model defined
import Doctor from "@/models/doctorModel";
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





export async function GET(req: Request) {
  try {
    await connectToDB(); // Ensure the database connection is established

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Ensure Doctor model is registered before querying
    if (!Doctor) {
      throw new Error("Doctor model is not registered.");
    }

    // Fetch cases where assignedDoctor matches userId
    const cases = await Case.find({ patientId: userId })
      .populate("assignedDoctor", "name") // 🔥 Mongoose looks for "Doctor" model here
      .lean();

    const formattedCases = cases.map((caseItem: any) => ({
      _id: caseItem._id.toString(),
      patientName: caseItem.patientName,
      assignedDoctor: caseItem.assignedDoctor?.name,
      organAffected: caseItem.organAffected,
      isClosed: caseItem.isClosed,
    }));

    return NextResponse.json(formattedCases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json({ message: "Failed to fetch cases" }, { status: 500 });
  }
}
