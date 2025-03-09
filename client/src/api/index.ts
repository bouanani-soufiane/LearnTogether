import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

export const apiInstance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

apiInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        try {
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
                const { state } = JSON.parse(authStorage);
                if (state.token) {
                    config.headers.Authorization = `Bearer ${state.token}`;

                    if (process.env.NODE_ENV !== 'production') {
                        const tokenPreview = state.token.substring(0, 10) + '...';
                        console.debug("Auth token attached:", `Bearer ${tokenPreview}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error processing authentication token:', error);
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('Request preparation error:', error.message);
        return Promise.reject(error);
    }
);

apiInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                console.warn('Authentication token expired or invalid');
                localStorage.removeItem('auth-storage');

                window.location.href = '/login?session=expired';
            }

            else if (status === 403) {
                console.warn('Access forbidden');
            }

            else if (status >= 500) {
                console.error('Server error:', error.response.data);
            }
        }
        else if (error.request) {
            console.error('Network error - no response received');
        }
        else {
            console.error('API request error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default apiInstance;