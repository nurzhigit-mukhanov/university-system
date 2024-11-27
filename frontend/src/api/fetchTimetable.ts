import API from "./axiosInstance";

export interface TimetableEntry {
  id: string;
  courseName: string;
  time: string;
  day: string;
}

export const fetchTimetable = async (): Promise<TimetableEntry[]> => {
  const response = await API.get<TimetableEntry[]>("/student/timetable");
  return response.data;
};
