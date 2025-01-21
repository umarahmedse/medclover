/* eslint-disable */

import { NextResponse } from "next/server";
import {Doctor} from "@/models";
import dbConnection from "@/lib/mongodb";
// Define the Doctor interface with _id as string
interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  isActive: boolean;
}

export async function GET(req: Request) {
  await dbConnection();
  try {
    // Use aggregate to group doctors by specialization directly in the database
    const groupedDoctors = await Doctor.aggregate([
      { $match: { isActive: true } },  // Filter active doctors
      { $group: {  // Group doctors by specialization
        _id: "$specialization",
        doctors: {
          $push: {
            id: { $toString: "$_id" },  // Convert _id to string
            name: "$name",
          },
        },
      }},
      { $project: { _id: 0, specialization: "$_id", doctors: 1 } },  // Restructure the output
      { $sort: { "specialization": 1 } },  // Optional: sort by specialization
    ]);

    // Convert to the expected format (if necessary)
    const result = groupedDoctors.reduce((acc: Record<string, { id: string; name: string }[]>, group) => {
      acc[group.specialization] = group.doctors;
      return acc;
    }, {});

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json({ message: "Failed to fetch doctors" }, { status: 500 });
  }
}
