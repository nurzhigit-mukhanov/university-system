import API from "./axiosInstance";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await API.post("/auth/login", { email, password });
  return response.data.token;
};
