import axios from "axios";
import { BACKEND_URL } from '@env';
import LoginRepository from "@/src/Repository/LoginRepository";

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

    // Enregistrer un token
    public setToken(token: string,refreshToken:string,refreshTime:number): void {
        this.token = token;
        this.refreshToken = refreshToken;
        clearTimeout(this.interval)
        this.interval = setInterval(() => LoginRepository.getInstance().refreshToken(this.token), refreshTime*0.3);
    }

    // Obtenir le token
    public getToken(): string | null {
        return this.token;
    }
}

export default TokenSingleton;