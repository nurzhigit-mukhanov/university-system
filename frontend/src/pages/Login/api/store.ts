import { create } from "zustand";
import API from "../../../utils/api";

interface LoginStore {
  login: (email: string, password: string) => Promise<void>;
}

export const useLoginStore = create<LoginStore>(() => ({
  login: async (email, password) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      window.location.href = `/${data.role}`;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  },
}));
