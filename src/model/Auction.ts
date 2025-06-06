import User from "@/src/model/User";
import Image from "@/src/model/Image";
import Offer from "@/src/model/Offer";

const unJour = 86400000

export default class Auction {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string;
    startingPrice: number;
    endAt: Date;
    author: User;
    highestOffer: number;
    offers: Offer[];
    offersCount?: number;
    images: Image[];

    constructor(
        id: number,
        createdAt: string,
        updatedAt: string,
        name: string,
        description: string,
        startingPrice: number,
        endAt: string,
        author: User,
        highestOffer: number,
        images: Image[],
    ) {
        this.id = id;
        this.createdAt = new Date(createdAt);
        this.updatedAt = new Date(updatedAt);
        this.name = name;
        this.description = description;
        this.startingPrice = startingPrice;
        this.endAt = new Date(endAt);
        this.author = author;
        this.highestOffer = highestOffer;
        this.images = images
        this.offers = []
    }

    public static mapFromJson(json: object): Auction {
        console.log(json)
        const auction = new Auction(
            json.id,
            new Date(json.created_at),
            new Date(json.updated_at),
            json.name,
            json.description,
            json.starting_price,
            new Date(json.end_at),
            User.mapFromJson(json.author),
            json.highest_offer,
            json.images.map((image: object) => Image.mapFromJson(image))
        );
        if (json.offers_count !== undefined) {
            auction.offersCount = json.offers_count
        }
        if (json.offers !== undefined) {
            auction.offers = json.offers.map((offer: object) => Offer.mapFromJson(offer));
        }
        return auction;
    }

    public isEnding(): boolean {
        return this.getRemainingTime().getTime() < unJour
    }

    public getRemainingTime() {
        return this.endAt !== null ? new Date(this.endAt.getTime()- Date.now()) : new Date(0)
    }
    public getRemainingTimeString() {
        const remainingTime = this.getRemainingTime().getTime();
        if (remainingTime > unJour) {
            return Math.floor(remainingTime / unJour) + " jours";
        } else {
            const hours = Math.floor((remainingTime % unJour) / 3600000);
            const minutes = Math.floor((remainingTime % 3600000) / 60000);
            return `${hours}h ${minutes}min`
        }
    }

    public isEnded(): boolean {
        return this.endAt < new Date()
    }
}