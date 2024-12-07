import { create } from "zustand";
import {
  fetchCoursesByGroup,
  registerCourse,
  dropCourse,
  Course,
} from "../../../api/courseApi";
import { fetchTimetable, TimetableEntry } from "../../../api/timetableApi";

interface StudentStore {
  courses: Course[];
  timetable: TimetableEntry[];
  selectedGroup: string;
  setGroup: (group: string) => void;
  loadCourses: () => Promise<void>;
  loadTimetable: () => Promise<void>;
  register: (courseId: string) => Promise<void>;
  drop: (courseId: string) => Promise<void>;
}

export const useStudentStore = create<StudentStore>((set, get) => ({
  courses: [],
  timetable: [],
  selectedGroup: "201",
  setGroup: (group) => set({ selectedGroup: group }),
  // Загружаем курсы для выбранной группы
  loadCourses: async () => {
    const { selectedGroup } = get();
    const data = await fetchCoursesByGroup(selectedGroup);
    set({ courses: data });
  },

  // Загружаем расписание
  loadTimetable: async () => {
    const data = await fetchTimetable();
    set({ timetable: data });
  },

  // Регистрация на курс
  register: async (courseId) => {
    const { courses, loadCourses, loadTimetable } = get();

    // Находим курс по ID
    const course = courses.find((c) => c._id === courseId);
    if (!course) {
      console.error("Course not found");
      return;
    }

    // Проверяем наличие необходимых полей
    if (!course.time || !course.weekday) {
      console.error("Course data is incomplete:", course);
      return;
    }

    // Формируем timetable
    const [startTime, endTime] = course.time.split("-");
    if (!startTime || !endTime) {
      console.error("Invalid course time format:", course.time);
      return;
    }

    const timetable = [
      {
        day: course.weekday,
        startTime,
        endTime,
      },
    ];

    console.log("Registering course with data:", { courseId, timetable });

    // Отправляем данные на сервер
    try {
      await registerCourse(courseId, timetable);
      console.log("Course registered successfully");
      await loadCourses(); // Обновляем список доступных курсов
      await loadTimetable(); // Обновляем расписание
    } catch (error) {
      console.error("Error registering course:", error);
    }
  },

  // Удаление курса
  drop: async (courseId) => {
    const { loadCourses, loadTimetable } = get();

    try {
      await dropCourse(courseId);
      console.log("Course dropped successfully");
      await loadCourses(); // Обновляем список доступных курсов
      await loadTimetable(); // Обновляем расписание
    } catch (error) {
      console.error("Error dropping course:", error);
    }
  },
}));
