class Auction {
    id: number;
    created_at: Date;
    updated_at: Date;
    name: string;
    description: string;
    starting_price: number;
    end_at: Date;
    highest_offer: number;
    author: User;
    constructor(
        id: number,
        created_at: Date,
        updated_at: Date,
        name: string,
        description: string,
        starting_price: number,
        end_at: Date,
        highest_offer: number,
        author: User
    ) {
        this.id = id;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.name = name;
        this.description = description;
        this.starting_price = starting_price;
        this.end_at = end_at;
        this.highest_offer = highest_offer;
        this.author = author;
    }

    get offers(): Offert[] {
        return new Array<Offert>();
    }
}