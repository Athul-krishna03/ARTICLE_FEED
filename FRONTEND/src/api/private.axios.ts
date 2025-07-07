import axios from "axios";
import { toast } from "@/hooks/useToast";


export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API,
    withCredentials: true,
});

let isRefreshing = false;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.error("Interceptor Error:", error);
        console.log("mess",error.response?.data?.message)
        const originalRequest = error.config;
        console.log("original", originalRequest);
        if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        error.response?.data?.message === "Invalid token"
        ) {
        originalRequest._retry = true;

        if (!isRefreshing) {
            isRefreshing = true;
            try {
            const refreshEndpoint = "/refresh-token";
            await axiosInstance.post(refreshEndpoint);
            isRefreshing = false;
            return axiosInstance(originalRequest);
            } catch (refreshError) {
            isRefreshing = false;
            handleLogout();
            return Promise.reject(refreshError);
            }
        }
        }

        const message = error.response?.data?.message;

        if (
        error.response?.status === 403 &&
        [
            "Token is blacklisted",
            "Access denied. You do not have permission to access this resource.",
            "Access denied: Your account has been blocked",
        ].includes(message) &&
        !originalRequest._retry
        ) {
        handleLogout();
        return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

function handleLogout() {
    localStorage.removeItem("user");
    window.location.href = "/";
    toast({
        title: "Error",
        description: "Please Login again",
        variant: "destructive",
        duration: 3000,
    });
}
