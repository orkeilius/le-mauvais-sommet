import axios, {AxiosInstance} from "axios";
import TokenSingleton from "@/src/Repository/TokenSingleton";
import { BACKEND_URL,BACKEND_ID,BACKEND_KEY } from '@env';

export abstract class AbscractRepository{
    private readonly token: TokenSingleton;
    protected constructor(){
        this.token = TokenSingleton.getInstance();
        console.log(BACKEND_URL);



    }

    protected getConnection(): AxiosInstance {
        return axios.create({
            baseURL: BACKEND_URL,
            timeout: 1000,
            headers: {
                'client_id': BACKEND_ID,
                'client_secret': BACKEND_KEY,
                'Authorization': `Bearer ${this.token.getToken()}`,
            }
        });
    }


}