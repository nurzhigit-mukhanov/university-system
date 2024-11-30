import API from "../utils/api";

// Типы для курсов
export interface Course {
  _id: string;
  name: string;
  description: string;
  teacherId: string;
  classroom: string;
  time: string;
  weekday: string;
  group: string;
}

// Получить список курсов для указанной группы
export const fetchCoursesByGroup = async (group: string): Promise<Course[]> => {
  const { data } = await API.get(`/student/courses?group=${group}`);
  return data;
};

// Зарегистрироваться на курс
export const registerCourse = async (
  courseId: string,
  timetable: { day: string; startTime: string; endTime: string }[]
): Promise<void> => {
  await API.post("/student/register", { courseId, timetable });
};

// Удалить курс из расписания
export const dropCourse = async (courseId: string): Promise<void> => {
  await API.delete(`/student/drop/${courseId}`);
};
