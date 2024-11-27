// Импортируем jwtDecode как named import
import { jwtDecode } from "jwt-decode";

// Определяем пользовательский интерфейс
export interface UserPayload {
  id: string;
  role: string;
  exp?: number; // Поле exp — срок действия токена
  iat?: number; // Поле iat — время создания токена
}

export const getUserFromToken = (): UserPayload | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // Приводим jwtDecode к корректному типу
    return jwtDecode<UserPayload>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
