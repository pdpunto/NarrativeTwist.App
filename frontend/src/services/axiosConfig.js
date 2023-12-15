import axios from 'axios';

function getToken() {
    return localStorage.getItem('token');
}

const instance = axios.create({
    baseURL: 'http://localhost:3001',
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
instance.interceptors.response.use(response => response, error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Redirigir a la página principal si hay un error de autenticación
        window.location = '/';
    }
    return Promise.reject(error);
});

export default instance;
