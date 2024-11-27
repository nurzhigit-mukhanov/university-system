import API from "./axiosInstance";

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<void> => {
  await API.post("/auth/register", userData);
};
