import axios from 'axios';
import type { ApiResponse } from '../interfaces';

const api = axios.create({
    baseURL: 'http://localhost:3001/api', // Backend URL
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors here
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// Generic fetcher
export async function get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await api.get<ApiResponse<T>>(url, { params });
    return response.data;
}

export async function post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await api.post<ApiResponse<T>>(url, data);
    return response.data;
}

export async function put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await api.put<ApiResponse<T>>(url, data);
    return response.data;
}

export async function del<T>(url: string): Promise<ApiResponse<T>> {
    const response = await api.delete<ApiResponse<T>>(url);
    return response.data;
}

export default api;
