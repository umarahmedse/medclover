/* eslint-disable*/

import mongoose from "mongoose";
import Doctor from "@/models/doctorModel"; // ✅ Import Doctor before using it

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
      ref: "Doctor", // ✅ This needs to be registered before use
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

const CaseModel = models.Cases || model("Cases", CaseModelSchema);

export default CaseModel;
