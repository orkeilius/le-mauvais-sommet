import { AbscractRepository } from "@/src/Repository/abscractRepository";

export default class OfferRepository extends AbscractRepository {
    private static instance: OfferRepository;

    private constructor() {
        super();
    }

    public static getInstance(): OfferRepository {
        if (!OfferRepository.instance) {
            OfferRepository.instance = new OfferRepository();
        }
        return OfferRepository.instance;
    }

    async postOffer(auctionId: number, price: number): Promise<any> {
        try {
            const response = await super.getConnection().post("/api/offers", {
                auction_id: auctionId,
                price: price,
            });
            return response.data;
        } catch (error) {
            console.error("Error making offer:", error);
            throw error;
        }
    }
}
