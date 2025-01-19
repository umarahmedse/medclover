/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import dbConnection from "../mongodb";
import User from "@/models/userModel";

export async function createUser(user: any) {
  try {
    await dbConnection();
    return await User.create(user);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}
