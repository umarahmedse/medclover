import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  clerkId: string;
  image_url:string;
}

const userSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  image_url: {
    type: String,
  },
});

export default userSchema;
