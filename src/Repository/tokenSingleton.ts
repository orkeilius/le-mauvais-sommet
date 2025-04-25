import axios from "axios";

class TokenSingleton {
    private static instance: TokenSingleton;
    private token: string | null = null;
    private refreshUrl: string = `${process.env.backend_url}oauth/token`;

    private interval: number | undefined;

    private constructor() {}

    // Obtenir l'instance unique
    public static getInstance(): TokenSingleton {
        if (!TokenSingleton.instance) {
            TokenSingleton.instance = new TokenSingleton();
        }
        return TokenSingleton.instance;
    }

    // Enregistrer un token
    public setToken(token: string): void {
        this.token = token;
        clearTimeout(this.interval)
        this.interval = setInterval(this.refreshUrl, 1000);
    }

    // Obtenir le token
    public getToken(): string | null {
        return this.token;
    }

    // Rafraîchir le token
    public async refreshToken(): Promise<void> {
        if (!this.token) {
            throw new Error("Aucun token à rafraîchir.");
        }

        try {
            const response = await axios.post(this.refreshUrl, {}, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
            this.token = response.data.token;
        } catch (error) {
            console.error("Erreur lors du rafraîchissement du token :", error);
            throw error;
        }
    }
}

export default TokenSingleton;