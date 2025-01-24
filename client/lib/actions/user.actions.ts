/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import dbConnection from "../mongodb";
import {User} from "@/models";

export async function createUser(user: any) {
  try {
    await dbConnection();
    return await User.create(user);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}


export async function updateUser(clerkId: string, updatedData: any) {
  try {
    await dbConnection();

    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      updatedData,
      { new: true, runValidators: false }
    );

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user.");
  }
}
