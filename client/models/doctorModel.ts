import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const DoctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
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
      required: true,
      default:"N/A"
    },
    experienceYears: {
      type: Number,
      required: true,
      min: 0,
      default:0
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Doctor = models.Doctor || model("Doctor", DoctorSchema);

export default Doctor;
