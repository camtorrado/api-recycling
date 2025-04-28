import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333', 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json', // Configuración de encabezados
    },
});

export default instance;