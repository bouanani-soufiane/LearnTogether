import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";


const setupDebugInterceptors = (axiosInstance: AxiosInstance): void => {
    axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            console.log('Request:', {
                url: config.url,
                method: config.method?.toUpperCase(),
                headers: config.headers,
                data: config.data
            });
            return config;
        },
        (error: AxiosError) => {
            console.error('Request Error:', error);
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
            console.log('Response:', {
                status: response.status,
                data: response.data
            });
            return response;
        },
        (error: AxiosError) => {
            console.error('Response Error:', {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data
                } : 'No response'
            });
            return Promise.reject(error);
        }
    );
};

export default setupDebugInterceptors;