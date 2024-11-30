import API from "../utils/api";

// Типы для пользователя
export interface User {
  id: string;
  role: string;
}

// Авторизация
export const login = async (email: string, password: string) => {
  const { data } = await API.post("/auth/login", { email, password });
  localStorage.setItem("token", data.token);
  return data.role as "student" | "teacher" | "admin";
};
