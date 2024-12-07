import { create } from "zustand";
import API from "../../../utils/api";

interface Course {
  _id: string;
  name: string;
  group: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface TeacherStore {
  courses: Course[];
  students: Student[];
  selectedCourse: Course | null;
  loading: boolean;
  loadCourses: () => Promise<void>;
  loadStudents: (courseId: string) => Promise<void>;
}

export const useTeacherStore = create<TeacherStore>((set) => ({
  courses: [],
  students: [],
  selectedCourse: null,
  loading: false,
  loadCourses: async () => {
    try {
      const { data } = await API.get("/teacher/courses");
      set({ courses: data });
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  },
  // Загружаем студентов для выбранного курса
  loadStudents: async (courseId: string) => {
    set({ loading: true });
    try {
      const { data } = await API.get(`/teacher/courses/${courseId}`);
      set({
        students: data.students, // Список студентов из course.students
        selectedCourse: { _id: data._id, name: data.name, group: data.group },
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching course details:", error);
      set({ loading: false });
    }
  },
}));
