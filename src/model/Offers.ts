import User from './User';

export default class Offer {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  authorId: number;
  auctionId: number;
  author: User;

  constructor(
    id: number,
    createdAt: string,
    updatedAt: string,
    price: number,
    authorId: number,
    auctionId: number,
    author: User
  ) {
    this.id = id;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
    this.price = price;
    this.authorId = authorId;
    this.auctionId = auctionId;
    this.author = author;
  }

  public static mapFromJson(json: object): Offer {
    return new Offer(
      json.id,
      json.created_at,
      json.updated_at,
      json.price,
      json.author_id,
      json.auction_id,
      User.mapFromJson(json.author)
    );
  }
}