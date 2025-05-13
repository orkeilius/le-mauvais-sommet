import UserRepository from "@/src/Repository/UserRepository";

export default class User {
  id: number;
  name: string;
  updatedAt: Date;
  role: string;
  avatarUrl: string;

  constructor(id: number, name: string, updatedAt: string, role: string, avatarUrl: string) {
    this.id = id;
    this.name = name;
    this.updatedAt = new Date(updatedAt);
    this.role = role;
    this.avatarUrl = avatarUrl;
  }
  public static mapFromJson(json:object){
    return new User(
        json.id,
        json.name,
        json.updated_at,
        json.role,
        json.avatar_url
    );
  }

  public getOffers(page=1) {
    return UserRepository.getInstance().getOffersFromUser(this, page)
  }
  public getAuction(page=1) {
    return UserRepository.getInstance().getAuctionFromUser(this, page)
  }


}