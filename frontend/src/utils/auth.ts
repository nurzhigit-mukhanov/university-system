import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: string;
}
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

export const isAuthenticated = () => !!localStorage.getItem("token");

export const logout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};
