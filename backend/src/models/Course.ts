import mongoose, { Schema, Document } from "mongoose";

// Define the interface for Course
export interface ICourse extends Document {
  name: string;
  description: string;
  teacherId: mongoose.Schema.Types.ObjectId;
  classroom: string;
  time: string;
  startTime?: string; // Optional if not persisted in the database
  endTime?: string; // Optional if not persisted in the database
  weekday: string;
  group: string;
  students: mongoose.Types.ObjectId[]; // Array of student references
}

// Define the schema
const CourseSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  classroom: { type: String, required: true },
  time: { type: String, required: true }, // Original time string
  startTime: { type: String, required: true }, // Store the derived start time
  endTime: { type: String, required: true }, // Store the derived end time
  weekday: { type: String, required: true },
  group: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of student IDs
});

export default mongoose.model<ICourse>("Course", CourseSchema);
