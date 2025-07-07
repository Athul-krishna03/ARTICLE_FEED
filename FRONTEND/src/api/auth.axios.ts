import axios from 'axios'


export const api = axios.create({
    baseURL:import.meta.env.VITE_API_AUTH_URL || "http://localhost:3000",
    withCredentials:true
    
})