class Offert {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    price: number;
    authorId: number;
    author: User;
    auction: Auction;
    constructor(id: number, createdAt: Date, updatedAt: Date, price: number, authorId: number, author: User, auction: Auction) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.price = price;
        this.authorId = authorId;
        this.author = author;
        this.auction = auction;
    }


}