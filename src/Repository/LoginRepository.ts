import {AbscractRepository} from "@/src/Repository/abscractRepository";
import TokenSingleton from "@/src/Repository/TokenSingleton";
import User from "@/src/model/User";
import axios from "axios";

export default class LoginRepository extends AbscractRepository{
    private static instance: LoginRepository;

    private constructor() {
        super();
    }

    public static getInstance(): LoginRepository {
        if (!LoginRepository.instance) {
            LoginRepository.instance = new LoginRepository();
        }
        return LoginRepository.instance;
    }

    async login(email: string, password: string): Promise<User> {
        const response = await axios.postForm(`${process.env.EXPO_PUBLIC_BACKEND_URL}oauth/token`, {
            client_id: process.env.EXPO_PUBLIC_BACKEND_ID,
            client_secret: process.env.EXPO_PUBLIC_BACKEND_KEY,
            grant_type: 'password',
            username: email,
            password,
        });
        TokenSingleton.getInstance().setToken(response.data.access_token, response.data.refresh_token, response.data.expires_in);
        return this.getLoggedUser();
    }

    async refreshToken(refreshToken: string): Promise<string> {
        const response = await axios.postForm(`${process.env.EXPO_PUBLIC_BACKEND_URL}oauth/token`, {
            client_id: process.env.EXPO_PUBLIC_BACKEND_ID,
            client_secret: process.env.EXPO_PUBLIC_BACKEND_KEY,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        });
        return response.data;
    }

    async getLoggedUser(): Promise<User> {
        const response = await this.getConnection().get('api/users/self');
        return User.mapFromJson(response.data);
    }
}