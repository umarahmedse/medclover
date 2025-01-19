import { NextResponse } from "next/server";
import MedicalRecord from "@/models/caseModel";
import connectToDB from "@/lib/mongodb";
import Case from "@/models/caseModel";  // Assuming you have a case model defined

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




export async function GET() {
  try {
    // Ensure MongoDB is connected
    await connectToDB();

    // Fetch cases and populate the assignedDoctor field
    const cases = await Case.find()
      .populate("assignedDoctor", "name")  // Populate the doctor’s name field
      .lean();  // .lean() returns plain JavaScript objects

    // Map the cases to the structure we need for the frontend
    const formattedCases = cases.map((caseItem: any) => ({
      _id: caseItem._id.toString(),  // Ensure _id is a string
      patientName: caseItem.patientName,
      assignedDoctor: caseItem.assignedDoctor?.name,  // Access the populated doctor's name
      organAffected: caseItem.organAffected,
      isClosed: caseItem.isClosed,
    }));

    return NextResponse.json(formattedCases); // Return the cases as JSON
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json({ message: "Failed to fetch cases" }, { status: 500 });
  }
}
