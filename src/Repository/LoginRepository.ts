import {AbscractRepository} from "@/src/Repository/abscractRepository";
import { BACKEND_ID,BACKEND_KEY,BACKEND_URL } from '@env';
import TokenSingleton from "@/src/Repository/TokenSingleton";
import UserRepository from "@/src/Repository/UserRepository";
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
        console.log(BACKEND_URL);
        const response = await axios.postForm(`${BACKEND_URL}oauth/token`, {
            client_id: BACKEND_ID,
            client_secret: BACKEND_KEY,
            username: email,
            password,
            grant_type: 'password',
        });
        TokenSingleton.getInstance().setToken(response.data.access_token, response.data.refresh_token, response.data.expires_in);
        return this.getLoggedUser();
    }

    async refreshToken(refreshToken: string): Promise<String> {
        const response = await axios.postForm(`${BACKEND_URL}oauth/token`, {
            client_id: BACKEND_ID,
            client_secret: BACKEND_KEY,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        });
        return response.data;
    }

    async getLoggedUser(): Promise<User> {
        console.log(this.getConnection().getUri())
        const response = await this.getConnection().get('/users/self');
        return User.mapFromJson(response.data);
    }
}