import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// ============================================
// API CLIENT - Axios Instance with Interceptors
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Log request in development
        if (import.meta.env.DEV) {
            console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }

        // Add auth token if exists (for future use)
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('❌ [Request Error]', error);
        return Promise.reject(error);
    }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log response in development
        if (import.meta.env.DEV) {
            console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
        }

        return response;
    },
    (error: AxiosError) => {
        // Handle different error statuses
        if (error.response) {
            const status = error.response.status;
            const url = error.config?.url;

            switch (status) {
                case 400:
                    console.error(`❌ [Bad Request] ${url}:`, error.response.data);
                    break;
                case 401:
                    console.error(`🔒 [Unauthorized] ${url}`);
                    // Could redirect to login or clear token
                    break;
                case 403:
                    console.error(`🚫 [Forbidden] ${url}`);
                    break;
                case 404:
                    console.error(`🔍 [Not Found] ${url}`);
                    break;
                case 422:
                    console.error(`⚠️ [Validation Error] ${url}:`, error.response.data);
                    break;
                case 500:
                    console.error(`💥 [Server Error] ${url}`);
                    break;
                default:
                    console.error(`❌ [Error ${status}] ${url}`);
            }
        } else if (error.request) {
            // Network error
            console.error('🌐 [Network Error] No response received:', error.message);
        } else {
            console.error('❌ [Error]', error.message);
        }

        return Promise.reject(error);
    }
);

// ============================================
// API ERROR TYPE
// ============================================
export interface ApiError {
    status: number;
    message: string;
    detail?: string | Record<string, unknown>[];
}

// Helper to extract error message
export const getApiErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (typeof data === 'string') {
            return data;
        }

        if (data?.detail) {
            if (typeof data.detail === 'string') {
                return data.detail;
            }
            if (Array.isArray(data.detail)) {
                return data.detail.map((d: { msg?: string }) => d.msg).join(', ');
            }
        }

        if (data?.message) {
            return data.message;
        }

        return error.message || 'An error occurred';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred';
};

export default api;
