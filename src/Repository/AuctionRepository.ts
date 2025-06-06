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

    public async getAuctionList(page: number, filter:string=""): Promise<Auction[]> {
        let url = `api/auctions?page=${page}`;
        if (filter !== "") {
            url += `&filter=${filter}`;
        }
        const response = await this.getConnection().get(url);
        return response.data.data.map((e: any) =>  Auction.mapFromJson(e))
    }

    public async getAuctionById(id: number): Promise<Auction> {
        const response = await this.getConnection().get(`api/auctions/${id}`);
        return Auction.mapFromJson(response.data);
    }

    public async create(name: string, description: string, startingPrice: number, endAt: Date, images?: any[]): Promise<Auction> {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('starting_price', startingPrice.toString());
        formData.append('end_at', endAt.toISOString());

        // Si des images sont fournies, les ajouter au FormData
        if (images && images.length > 0) {
            images.forEach((image, index) => {
                formData.append(`images[${index}]`, {
                    uri: image.uri,
                    type: image.type || 'image/jpeg',
                    name: image.name || `image_${index}.jpg`,
                } as any);
            });
        }

        const response = await this.getConnection().post('api/auctions', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return Auction.mapFromJson(response.data);
    }
}