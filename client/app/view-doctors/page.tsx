import { columns } from "@/components/doctors-table";
import { DataTable } from "@/components/ui/data-table";
import connectToDB from "@/lib/mongodb";
import { Doctor } from "@/models"; // Ensure you have a TypeScript type
export interface Doctor {
    _id: string; // MongoDB ObjectId as a string
    name: string;
    email: string;
    phone: string;
    specialization:
      | "Cardiology"
      | "Neurology"
      | "Orthopedics"
      | "Dermatology"
      | "Ophthalmology"
      | "Pulmonology"
      | "Gastroenterology"
      | "Urology"
      | "Endocrinology"
      | "General Medicine";
    experienceYears: number;
    isActive: boolean;
    createdAt: string; // Timestamps from Mongoose
    updatedAt: string;
    image_url:string;
  }
  
  export default async function DoctorsPage() {
    await connectToDB(); // Ensure DB connection
    const doctors = await Doctor.find({}).lean(); // Fetch doctors
  
   // Assuming the 'doctor' has _id as an ObjectId type from MongoDB
const formattedDoctors = doctors.map(doctor => ({
    ...doctor,
    _id: doctor._id ? doctor._id.toString() : "", // Safely converting _id to string
})) as unknown as Doctor[];  // Now the formattedDoctors is of type Doctor[]
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Doctors List</h1>
        <DataTable columns={columns} data={formattedDoctors} />
      </div>
    );
  }