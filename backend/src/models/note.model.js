import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    imageUrl: {
      type: String, // Stores the URL from Cloudinary or Supabase
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User", // This establishes the relationship to the User model
      required: true,
      index: true
    },
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);