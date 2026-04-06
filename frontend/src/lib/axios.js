import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: `${apiUrl}/api`,
    withCredentials: true, // Send cookies to the server
});

export default axiosInstance;
