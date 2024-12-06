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
  newName: string;
  newRole: string;
  setUsers: (users: User[]) => void;
  startEditing: (user: User) => void;
  cancelEditing: () => void;
  updateUserLocally: (userId: string, updatedFields: Partial<User>) => void;
  setNewName: (name: string) => void;
  setNewRole: (role: string) => void;
  fetchUsers: () => Promise<void>;
  saveChanges: () => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  users: [],
  editingUser: null,
  newName: "",
  newRole: "",
  setUsers: (users: User[]) => set({ users }),
  startEditing: (user: User) =>
    set({ editingUser: user, newName: user.name, newRole: user.role }),
  cancelEditing: () => set({ editingUser: null, newName: "", newRole: "" }),
  updateUserLocally: (userId: string, updatedFields: Partial<User>) =>
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, ...updatedFields } : user
      ),
    })),
  setNewName: (name: string) => set({ newName: name }),
  setNewRole: (role: string) => set({ newRole: role }),
  fetchUsers: async () => {
    try {
      const { data } = await API.get<User[]>("/admin/users");
      set({ users: data });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },
  saveChanges: async () => {
    const { editingUser, newName, newRole, cancelEditing, updateUserLocally } =
      get();
    if (!editingUser) return;

    try {
      const updatedUser = { name: newName, role: newRole }; // Поля _id нет
      await API.put(`/admin/users/${editingUser._id}`, updatedUser);
      updateUserLocally(editingUser._id, updatedUser);
      cancelEditing();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },
}));
