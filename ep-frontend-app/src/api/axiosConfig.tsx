import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { environment } from '../config/environment';
import { appPreferences } from "../utils";

const api: AxiosInstance = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const setupInterceptors = (showLoader: () => void, hideLoader: () => void, showToast: (message: string) => void) => {
    api.interceptors.request.use(
        (config) => {
            showLoader();
            switch (config.url) {
                case '/api/v1/auth':
                    config.baseURL = environment.authApiBaseUrl;
                    break;
                case '/api/v1/user':
                    config.baseURL = environment.userApiBaseUrl;
                    break;
                case '/api/v1/admin':
                    config.baseURL = environment.adminApiBaseUrl;
                    break;
                case '/api/v1/polling':
                    config.baseURL = environment.pollingApiBaseUrl;
                    break;
                default:
                    config.baseURL = environment.apiBaseUrl;
            }

            const token = appPreferences.getItem('token');
            if (token) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            hideLoader();
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response: AxiosResponse) => {
            hideLoader();
            return response;
        },
        (error: any) => {
            hideLoader();
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || 'An error occurred';
                showToast(errorMessage);
            }
            return Promise.reject(error);
        }
    );
};

export default api;
export { setupInterceptors };
