import axios, {AxiosInstance} from "axios";
import TokenSingleton from "@/src/Repository/TokenSingleton";

export abstract class AbscractRepository{
    private readonly token: TokenSingleton;
    protected constructor(){
        this.token = TokenSingleton.getInstance();



    }

    protected getConnection(): AxiosInstance {
        return axios.create({
            baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
            timeout: 1000,
            headers: {
                'client_id': process.env.EXPO_PUBLIC_BACKEND_ID,
                'client_secret': process.env.EXPO_PUBLIC_BACKEND_KEY,
                'Authorization': `Bearer ${this.token.getToken()}`,
            }
        });
    }


}