import UserRepository from "@/src/Repository/UserRepository";

export default class User {
    id: number;
    name: string;
    updatedAt: Date;
    role: string;
    avatarUrl: string;
    email = "";
    createdAt : Date;

    stats?: {
        auctions_ongoing: number,
        auctions_ended: number,
        auctions_won: number,
    };

    constructor(id: number, name: string, updatedAt: string, role: string, avatarUrl: string, createdAt: string) {
        this.id = id;
        this.name = name;
        this.updatedAt = new Date(updatedAt);
        this.role = role;
        this.avatarUrl = avatarUrl;
        this.createdAt = new Date(createdAt);
    }

    public static mapFromJson(json: object) {
        const user = new User(
            json.id,
            json.name,
            json.updated_at,
            json.role,
            json.avatar_url,
            json.created_at
        );
        if (json.email) {
            user.email = json.email
        }
        if (json.stats) {
            user.stats = {
                auctions_ongoing: json.stats.auctions_ongoing,
                auctions_ended: json.stats.auctions_ended,
                auctions_won: json.stats.auctions_won,
            }
        }
        return user;
    }

    public getOffers(page = 1) {
        return UserRepository.getInstance().getOffersFromUser(this, page)
    }

    public getAuction(page = 1,filter="") {
        return UserRepository.getInstance().getAuctionFromUser(this, page,filter)
    }


}