import axios, {AxiosInstance} from "axios";
import TokenSingleton from "@/src/Repository/TokenSingleton";
import ApiConfig from "@/src/Repository/ApiConfig";

export abstract class AbscractRepository{
    private readonly token: TokenSingleton;
    private readonly apiConfig: ApiConfig;
    
    protected constructor(){
        this.token = TokenSingleton.getInstance();
        this.apiConfig = ApiConfig.getInstance();
    }

    protected getConnection(): AxiosInstance {
        return this.apiConfig.getAxiosInstance();
    }

    // Méthodes de commodité utilisant la nouvelle configuration
    protected async get(url: string, config?: any) {
        return this.apiConfig.get(url, config);
    }

    protected async post(url: string, data?: any, config?: any) {
        return this.apiConfig.post(url, data, config);
    }

    protected async put(url: string, data?: any, config?: any) {
        return this.apiConfig.put(url, data, config);
    }

    protected async delete(url: string, config?: any) {
        return this.apiConfig.delete(url, config);
    }
}