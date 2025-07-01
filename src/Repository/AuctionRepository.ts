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

    public async getAuctionList(page: number, filter:string="",query:string|null=null): Promise<Auction[]> {
        let url = `api/auctions?page=${page}`;
        console.log(`Fetching auctions with URL: ${query}`);
        if (query !== null && query !== "") {
            url += `&search=${encodeURIComponent(query)}`;
        }
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
            for (let index = 0; index < images.length; index++) {
                const image = images[index];
                
                // Pour React Native Web, on doit créer un Blob à partir de l'URI
                if (image.uri) {
                    try {
                        const response = await fetch(image.uri);
                        const blob = await response.blob();
                        // Essayer différents formats de nom de champ
                        formData.append('images[]', blob, image.name || `image_${index}.jpg`);
                    
                    } catch (error) {
                        console.warn(`Erreur lors du traitement de l'image ${index}:`, error);
                        // Si la conversion échoue, on essaie avec l'objet original
                        formData.append('images[]', {
                            uri: image.uri,
                            type: image.type || 'image/jpeg',
                            name: image.name || `image_${index}.jpg`,
                        } as any);
                    }
                }
            }
        }

        try {
            const response = await this.getConnection().post('api/auctions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return Auction.mapFromJson(response.data);
        } catch (error: any) {
            // Log detailed error information
            console.error('Error creating auction:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    }
}