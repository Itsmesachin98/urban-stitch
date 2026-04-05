import { create } from "zustand";
import { toast } from "react-hot-toast";

import axios from "../lib/axios";

const useUserStore = create((set) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    // GET api/auth/profile
    checkAuth: async () => {
        set({ checkingAuth: true });

        try {
            const res = await axios.get("/auth/profile");
            set({ user: res?.data?.user || null });
        } catch (error) {
            console.error("Auth check failed: ", error);
            set({ user: null });
        } finally {
            set({ checkingAuth: false });
        }
    },

    // POST api/auth/signup
    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        try {
            // Normalize input
            const trimmedName = name?.trim();
            const trimmedEmail = email?.trim();

            // Validation
            if (!trimmedName) {
                set({ loading: false });
                return toast.error("Full name is required");
            }

            if (!trimmedEmail) {
                set({ loading: false });
                return toast.error("Email is required");
            }

            if (!password) {
                set({ loading: false });
                return toast.error("Password is required");
            }

            if (password !== confirmPassword) {
                set({ loading: false });
                return toast.error("Passwords do not match");
            }

            const res = await axios.post("/auth/signup", {
                name: trimmedName,
                email: trimmedEmail,
                password,
            });

            set({ user: res?.data?.user });
            toast.success(res?.data?.message || "Signup successful");
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong. Please try again.";

            toast.error(message);
        } finally {
            set({ loading: false });
        }
    },

    // POST api/auth/login
    login: async (email, password) => {
        set({ loading: true });

        try {
            // Normalize input
            const trimmedEmail = email?.trim();

            // Validation
            if (!trimmedEmail) {
                set({ loading: false });
                return toast.error("Email is required");
            }

            if (!password) {
                set({ loading: false });
                return toast.error("Password is required");
            }

            const res = await axios.post("/auth/login", {
                email: trimmedEmail,
                password,
            });

            set({ user: res?.data?.user });
            toast.success(res?.data?.message || "Login successful");
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong. Please try again.";

            toast.error(message);
        } finally {
            set({ loading: false });
        }
    },

    // POST api/auth/logout
    logout: async () => {
        try {
            await axios.post("/auth/logout");
            set({ user: null });
            toast.success("Logged out successfully");
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to logout. Please try again.";

            toast.error(message);
        }
    },
}));

// TODO: Implement the axios interceptors for refreshing the access token

export default useUserStore;
