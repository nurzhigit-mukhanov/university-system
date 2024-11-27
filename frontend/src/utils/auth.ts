import jwtDecode, { JwtPayload } from "jwt-decode";

// Расширяем JwtPayload для поддержки пользовательских полей
interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

// Проверяем, аутентифицирован ли пользователь
export const isAuthenticated = (): boolean => !!localStorage.getItem("token");

// Удаляем токен и перезагружаем страницу
export const logout = (): void => {
  localStorage.removeItem("token");
  window.location.reload();
};

/*
export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // Use the CustomJwtPayload interface to decode the token
    return jwtDecode<CustomJwtPayload>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
*/

export interface User {
  id: string;
  name: string;
  role: string;
}

export function getUserFromToken(): User | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const user: User = JSON.parse(atob(token.split(".")[1]));
    return user;
  } catch (err) {
    console.error("Invalid token");
    return null;
  }
}
