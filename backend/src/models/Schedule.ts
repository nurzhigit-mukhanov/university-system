import mongoose, { Schema, Document } from "mongoose";

interface ITimetableEntry {
  day: string;
  startTime: string;
  endTime: string;
}

interface ISchedule extends Document {
  studentId: mongoose.Schema.Types.ObjectId;
  courseId: mongoose.Schema.Types.ObjectId;
  timetable: ITimetableEntry[];
}

const ScheduleSchema: Schema = new Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  timetable: [
    {
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
});

export default mongoose.model<ISchedule>("Schedule", ScheduleSchema);
