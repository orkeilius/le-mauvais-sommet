import LoginRepository from "@/src/Repository/LoginRepository";
import AsyncStorage from '@react-native-async-storage/async-storage';

class TokenSingleton {
    private static instance: TokenSingleton;
    private token: string | null = null;
    private refreshToken: string | null = null;

    private interval: NodeJS.Timeout | undefined;

    private constructor() {}

    // Obtenir l'instance unique
    public static getInstance(): TokenSingleton {
        if (!TokenSingleton.instance) {
            TokenSingleton.instance = new TokenSingleton();
        }
        return TokenSingleton.instance;
    }

    public async getTokenFromStorage() {
        const token = await AsyncStorage.getItem('token');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (token) {
            this.token = token;
        }
        if (refreshToken) {
            this.refreshToken = refreshToken;
        }
    }

    // Enregistrer un token
    public setToken(token: string, refreshToken: string, refreshTime: number): void {
        this.token = token;
        this.refreshToken = refreshToken;
        if (this.interval) {
            clearInterval(this.interval);
        }
        // Refresh automatique à mi-temps d'expiration
        if (this.token) {
            this.interval = setInterval(() => {
                if (this.token) {
                    LoginRepository.getInstance().refreshToken(this.token);
                }
            }, refreshTime * 500); // refreshTime en secondes, converti en millisecondes et divisé par 2
        }
        AsyncStorage.setItem('token', token);
        AsyncStorage.setItem('refreshToken', refreshToken);
    }

    // Obtenir le token
    public getToken(): string | null {
        return this.token;
    }

    // Obtenir le refresh token
    public getRefreshToken(): string | null {
        return this.refreshToken;
    }

    // Vider les tokens
    public clearToken(): void {
        this.token = null;
        this.refreshToken = null;
        if (this.interval) {
            clearInterval(this.interval);
        }
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('refreshToken');
    }

    // Vérifier si le token existe
    public hasToken(): boolean {
        return this.token !== null;
    }
}

export default TokenSingleton;