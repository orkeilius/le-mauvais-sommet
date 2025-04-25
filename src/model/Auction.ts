export default class Auction {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  startingPrice: number;
  endAt: Date;
  authorId: number;
  highestOffer: number;

  constructor(
    id: number,
    createdAt: string,
    updatedAt: string,
    name: string,
    description: string,
    startingPrice: number,
    endAt: string,
    authorId: number,
    highestOffer: number
  ) {
    this.id = id;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
    this.name = name;
    this.description = description;
    this.startingPrice = startingPrice;
    this.endAt = new Date(endAt);
    this.authorId = authorId;
    this.highestOffer = highestOffer;
  }

  public static mapFromJson(json: any): Auction {
    return new Auction(
      json.id,
      json.created_at,
      json.updated_at,
      json.name,
      json.description,
      json.starting_price,
      json.end_at,
      json.author_id,
      json.highest_offer
    );
  }
}