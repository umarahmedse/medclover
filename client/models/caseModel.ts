import mongoose from "mongoose";

const { Schema } = mongoose;

const CaseModelSchema = new Schema(
  {
    patientName: {
      type: String,
      required: true,
    },
    patientAge: {
      type: Number,
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", // This will be registered in the central place
      required: true,
    },
    organAffected: {
      type: [String],
      required: true,
    },
    patientDescription: {
      type: String,
      required: true,
      default: "",
    },
    doctorRemarks: {
      type: String,
      default: "",
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default CaseModelSchema;
