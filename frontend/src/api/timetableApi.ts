import API from "../utils/api";

// Тип для записи в расписании
export interface TimetableEntry {
  _id: string;
  courseId: {
    _id: string;
    name: string;
    classroom: string;
    description: string;
    time: string;
    weekday: string;
    teacherId?: string;
  };
  name: string;
  description: string;
  time: string;
  classroom: string;
  day: string;
  startTime?: string;
  endTime?: string;
  teacherName?: string;
}

// Получить расписание студента
export const fetchTimetable = async (): Promise<TimetableEntry[]> => {
  const { data } = await API.get("/student/timetable");
  return data.map((entry: TimetableEntry) => ({
    ...entry,
    startTime: entry.startTime || "00:00",
    endTime: entry.endTime || "23:59",
    classroom: entry.courseId.classroom || "N/A",
    teacherName: entry.courseId.teacherId || "Unknown",
    description: entry.courseId.description || "",
  }));
};
