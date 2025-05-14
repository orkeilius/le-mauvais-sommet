import User from "@/src/model/User";
import Image from "@/src/model/Image";

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
        images: Image[]
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
    }

    public static mapFromJson(json: object): Auction {
        return new Auction(
            json.id,
            Date(json.created_at),
            Date(json.updated_at),
            json.name,
            json.description,
            json.starting_price,
            Date(json.end_at),
            User.mapFromJson(json.author),
            json.highest_offer,
            json.images.map((image: object) => Image.mapFromJson(image))
        );
    }

    public isEnding(): boolean {
        return this.getRemainingTime().getTime() < unJour
    }

    public getRemainingTime() {
        return this.endAt !== null ? new Date(Date.now() - this.endAt.getTime()) : new Date()
    }
    public getRemainingTimeString() {
        const remainingTime = this.getRemainingTime()
        if (remainingTime.getTime() > unJour) {
            return  Math.round(remainingTime.getTime() / unJour) + " jours";
        } else {
            return `${remainingTime.getHours()}h ${remainingTime.getMinutes()}`
        }
    }

    public isEnded(): boolean {
        return this.endAt < new Date()
    }
}