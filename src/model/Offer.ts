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

  public static mapFromJson(json: any): Offer {
    console.log('Mapping offer from JSON:', json);
    
    // Handle missing or null author
    let author;
    if (json.author && typeof json.author === 'object') {
      try {
        author = User.mapFromJson(json.author);
        console.log('Successfully mapped author:', author);
      } catch (error) {
        console.warn('Error mapping author, using fallback:', error);
        author = new User(json.author_id || 0, 'Unknown', new Date().toISOString(), 'user', '', new Date().toISOString());
      }
    } else {
      console.warn('No author data found in offer, using fallback. Author data:', json.author);
      // Create a placeholder user if author is missing
      author = new User(json.author_id || 0, 'Unknown', new Date().toISOString(), 'user', '', new Date().toISOString());
    }
    
    return new Offer(
      json.id,
      json.created_at,
      json.updated_at,
      json.price,
      json.author_id,
      json.auction_id,
      author
    );
  }
}