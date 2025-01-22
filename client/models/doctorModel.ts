import mongoose from "mongoose";

const { Schema } = mongoose;

const DoctorSchema = new Schema(
  {
    clerkId: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
    },
    specialization: {
      type: String,
      enum: [
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Dermatology",
        "Ophthalmology",
        "Pulmonology",
        "Gastroenterology",
        "Urology",
        "Endocrinology",
        "General Medicine",
      ],
    },
    experienceYears: {
      type: Number,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isProfileCompleted:{
      type:Boolean,
      default:false
    }
    
    

  },
  { timestamps: true }
);

export default DoctorSchema;
