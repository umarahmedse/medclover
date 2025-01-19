import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

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
      ref: "Doctor",
      required: true,
    },
    organAffected: {
      type: [String],  // This allows for an array of strings
      required: true,
    },
    patientDescription: {
      type: String,
      required: true,
      default:""
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

const CaseModel =
  models.Cases || model("Cases", CaseModelSchema);

export default CaseModel;
