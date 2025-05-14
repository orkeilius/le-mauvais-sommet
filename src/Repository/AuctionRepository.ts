import {AbscractRepository} from "@/src/Repository/abscractRepository";
import Auction from "@/src/model/Auction";

export default class AuctionRepository extends AbscractRepository {
    private static instance: AuctionRepository;

    private constructor() {
        super();
    }

    public static getInstance(): AuctionRepository {
        if (!AuctionRepository.instance) {
            AuctionRepository.instance = new AuctionRepository();
        }
        return AuctionRepository.instance;
    }

    public async getAuctionList(page: number, filter="string"): Promise<Auction[]> {
        const response = await this.getConnection().get(`api/auctions?page=${page}&filter=${filter}`);
        return response.data.data.map(e =>  Auction.mapFromJson(e))
    }

    public async getAuctionById(id: number): Promise<Auction> {
        const response = await this.getConnection().get(`api/auctions/${id}`);
        return Auction.mapFromJson(response.data);
    }
}