import axios from 'axios';

function getToken() {
    return localStorage.getItem('token');
}

const instance = axios.create({
    baseURL: 'http://localhost:3000', // Cambia a tu dominio real
});

// Interceptor de solicitud para añadir el token a cada solicitud
instance.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor de respuesta para manejar errores de autenticación


export default instance;
