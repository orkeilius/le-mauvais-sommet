import LoginRepository from "@/src/Repository/LoginRepository";
import AsyncStorage from '@react-native-async-storage/async-storage';

class TokenSingleton {
    private static instance: TokenSingleton;
    private token: string | null = null;
    private refreshToken: string | null = null;

    private interval: Timeout | undefined;

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
    public setToken(token: string,refreshToken:string,refreshTime:number): void {
        this.token = token;
        this.refreshToken = refreshToken;
        clearTimeout(this.interval)
        this.interval = setInterval(() => LoginRepository.getInstance().refreshToken(this.token), refreshTime*0.5);
        AsyncStorage.setItem('token', token);
        AsyncStorage.setItem('refreshToken', refreshToken);
    }

    // Obtenir le token
    public getToken(): string | null {
        return this.token;
    }
}

export default TokenSingleton;