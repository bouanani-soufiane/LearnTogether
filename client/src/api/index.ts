import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

// Create API instance with base configuration
export const apiInstance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Request interceptor for attaching JWT token
apiInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        // Try to get authentication token from local storage
        try {
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
                const { state } = JSON.parse(authStorage);
                if (state.token) {
                    // Set Authorization header with token for all requests
                    config.headers.Authorization = `Bearer ${state.token}`;

                    // Only log in development environment
                    if (process.env.NODE_ENV !== 'production') {
                        const tokenPreview = state.token.substring(0, 10) + '...';
                        console.debug("Auth token attached:", `Bearer ${tokenPreview}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error processing authentication token:', error);
            // Continue with request even if token processing fails
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('Request preparation error:', error.message);
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
apiInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // Handle specific HTTP status codes
        if (error.response) {
            const { status } = error.response;

            // Authentication errors
            if (status === 401) {
                console.warn('Authentication token expired or invalid');
                localStorage.removeItem('auth-storage');

                // Use history API to avoid full page reload if possible
                window.location.href = '/login?session=expired';
            }

            // Forbidden errors
            else if (status === 403) {
                console.warn('Access forbidden');
                // Could redirect to an access denied page
            }

            // Server errors
            else if (status >= 500) {
                console.error('Server error:', error.response.data);
                // Could show a generic server error notification
            }
        }
        // Network errors
        else if (error.request) {
            console.error('Network error - no response received');
            // Could show a network error notification
        }
        // Other errors
        else {
            console.error('API request error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default apiInstance;