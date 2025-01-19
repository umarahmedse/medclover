import { NextResponse } from "next/server";
import Doctor from "@/models/doctorModel";

// Define the Doctor interface with _id as string
interface Doctor {
  _id: string;  // Ensure _id is a string
  name: string;
  specialization: string;
  isActive: boolean;
}

export async function GET(req: Request) {
  try {
    // Fetch all active doctors using lean() to get plain objects
    const doctors = await Doctor.find({ isActive: true }).lean(); // lean() returns plain JavaScript objects

    // Explicitly typecast the result to Doctor[]
    const typedDoctors: Doctor[] = doctors.map((doc:any) => ({
      _id: doc._id.toString(),  // Ensure _id is converted to a string
      name: doc.name,
      specialization: doc.specialization,
      isActive: doc.isActive,
    }));

    // Group doctors by specialization
    const groupedDoctors: Record<string, { id: string; name: string }[]> = {};

    typedDoctors.forEach((doctor) => {
      const specialization = doctor.specialization;

      // If group doesn't exist for this specialization, create it
      if (!groupedDoctors[specialization]) {
        groupedDoctors[specialization] = [];
      }

      // Add doctor to the group
      groupedDoctors[specialization].push({
        id: doctor._id,  // Ensure _id is in string format
        name: doctor.name,
      });
    });

    return NextResponse.json(groupedDoctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json({ message: "Failed to fetch doctors" }, { status: 500 });
  }
}
