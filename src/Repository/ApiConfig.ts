import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import TokenSingleton from './TokenSingleton';

class ApiConfig {
    private static instance: ApiConfig;
    private axiosInstance: AxiosInstance;

    private constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8000/api/',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        this.setupInterceptors();
    }

    public static getInstance(): ApiConfig {
        if (!ApiConfig.instance) {
            ApiConfig.instance = new ApiConfig();
        }
        return ApiConfig.instance;
    }

    private setupInterceptors() {
        // Request interceptor pour ajouter le token
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = TokenSingleton.getInstance().getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                
                // Ajouter les credentials OAuth si nécessaires
                if (process.env.EXPO_PUBLIC_BACKEND_ID && process.env.EXPO_PUBLIC_BACKEND_KEY) {
                    config.headers.client_id = process.env.EXPO_PUBLIC_BACKEND_ID;
                    config.headers.client_secret = process.env.EXPO_PUBLIC_BACKEND_KEY;
                }
                
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor pour gérer les erreurs
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    
                    // Essayer de refresh le token
                    const refreshToken = TokenSingleton.getInstance().getRefreshToken();
                    if (refreshToken) {
                        try {
                            const refreshResponse = await this.refreshToken(refreshToken);
                            TokenSingleton.getInstance().setToken(
                                refreshResponse.access_token,
                                refreshResponse.refresh_token,
                                refreshResponse.expires_in
                            );
                            
                            // Retry la requête originale
                            originalRequest.headers.Authorization = `Bearer ${refreshResponse.access_token}`;
                            return this.axiosInstance(originalRequest);
                        } catch (refreshError) {
                            // Refresh failed, redirect to login
                            TokenSingleton.getInstance().clearToken();
                            // Vous pouvez ajouter ici la logique de redirection vers login
                        }
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private async refreshToken(refreshToken: string) {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL?.replace('/api/', '')}/oauth/token`, {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.EXPO_PUBLIC_BACKEND_ID,
            client_secret: process.env.EXPO_PUBLIC_BACKEND_KEY,
        });
        return response.data;
    }

    public getAxiosInstance(): AxiosInstance {
        return this.axiosInstance;
    }

    // Méthodes de commodité
    public async get(url: string, config?: AxiosRequestConfig) {
        return this.axiosInstance.get(url, config);
    }

    public async post(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.axiosInstance.post(url, data, config);
    }

    public async put(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.axiosInstance.put(url, data, config);
    }

    public async delete(url: string, config?: AxiosRequestConfig) {
        return this.axiosInstance.delete(url, config);
    }
}

export default ApiConfig;
