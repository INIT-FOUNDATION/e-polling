import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { environment } from '../config/environment';
import { appPreferences } from "../utils";
import { LogLevel } from '../types/globalTypes';

const api: AxiosInstance = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const setupInterceptors = (showLoader: () => void, hideLoader: () => void, showToast: (message: string) => void, log: (level: LogLevel, message: string, ...args: any[]) => void) => {
    api.interceptors.request.use(
        (config) => {
            const shouldIgnoreLoader = environment.skipLoaderRoutes.some(route => config.url?.startsWith(route));           
            if (!shouldIgnoreLoader) {
                showLoader(); 
            }

            if (config.url?.startsWith('/api/v1/auth')) {
                config.baseURL = environment.authApiBaseUrl;
            } else if (config.url?.startsWith('/api/v1/user')) {
                config.baseURL = environment.userApiBaseUrl;
            } else if (config.url?.startsWith('/api/v1/admin')) {
                config.baseURL = environment.adminApiBaseUrl;
            } else if (config.url?.startsWith('/api/v1/polling')) {
                config.baseURL = environment.pollingApiBaseUrl;
            } else {
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
            log('debug', 'api', response);
            return response;
        },
        (error: any) => {
            log('error', 'api', error);
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
