import { create } from "zustand";
import API from "../../../utils/api";

// Типы
interface User {
  _id: string;
  name: string;
  role: string;
}

interface AdminStore {
  users: User[];
  editingUser: User | null;
  setUsers: (users: User[]) => void;
  startEditing: (user: User) => void;
  cancelEditing: () => void;
  updateUserLocally: (userId: string, updatedFields: Partial<User>) => void;
  fetchUsers: () => Promise<void>;
  saveChanges: (name: string, role: string) => Promise<void>; // Форма передаёт данные
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  users: [],
  editingUser: null,
  setUsers: (users: User[]) => set({ users }),
  startEditing: (user: User) => set({ editingUser: user }),
  cancelEditing: () => set({ editingUser: null }),
  updateUserLocally: (userId: string, updatedFields: Partial<User>) =>
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, ...updatedFields } : user
      ),
    })),
  fetchUsers: async () => {
    try {
      const { data } = await API.get<User[]>("/admin/users");
      set({ users: data });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },
  saveChanges: async (name: string, role: string) => {
    const { editingUser, updateUserLocally, cancelEditing } = get();
    if (!editingUser) return;

    try {
      const updatedUser = { name, role };
      await API.put(`/admin/users/${editingUser._id}`, updatedUser);
      updateUserLocally(editingUser._id, updatedUser);
      cancelEditing();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },
}));
