import mongoose from "mongoose";
import DoctorSchema from "./doctorModel";
import CaseSchema from "./caseModel";
import UserSchema from "./userModel"; // Import User schema

// Centralized function to register models
const registerModel = (modelName: string, schema: mongoose.Schema) => {
  return mongoose.models[modelName] || mongoose.model(modelName, schema);
};

// ✅ Manually register models here
export const Doctor = registerModel("Doctor", DoctorSchema);
export const Case = registerModel("Cases", CaseSchema);
export const User = registerModel("User", UserSchema); // Register User model
