import User from '../model/User';
import {AbscractRepository} from './abscractRepository';
import Auction from "@/src/model/Auction";
import Offer from "@/src/model/Offer";


export default class UserRepository extends AbscractRepository {
    private static instance: UserRepository;

    private constructor() {
        super();
    }

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    // Obtenir un utilisateur par ID
    async getById(id: number): Promise<User> {
        const response = await this.get(`users/${id}`);
        return User.mapFromJson(response.data);
    }

    // Sauvegarder un utilisateur (créer ou mettre à jour)
    async save(name: string, email: string, password: string): Promise<User> {
        const response = await this.post(`users`, {
            name,
            email,
            password,
            password_confirmation: password,
        });
        return User.mapFromJson(response.data);
    }

    async getOffersFromUser(user: User, page = 1): Promise<Offer[]> {
        const response = await this.get(`users/${user.id}/offer?page=${page}`);
        return response.data.map((offer: any) => {
            offer.author = user
            return Offer.mapFromJson(offer);
        });
    }

    async getAuctionFromUser(user: User, page = 1, filter = ""): Promise<Auction[]> {
        let url = `users/${user.id}/auction?page=${page}`;
        if (filter !== "") {
            url += `&filter=${filter}`;
        }
        const response = await this.get(url);
        return response.data.data.map((auction: Auction) => {
            auction.author = user
            return Auction.mapFromJson(auction);
        });
    }

    // Supprimer un utilisateur par ID
    async deleteUser(id: number): Promise<void> {
        await this.delete(`users/${id}`);
    }
}
