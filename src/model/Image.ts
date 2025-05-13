export default class Image {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  url: string;
  description: string;

  constructor(
    id: number,
    createdAt: string,
    updatedAt: string,
    url: string,
    description: string,
  ) {
    this.id = id;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
    this.url = url;
    this.description = description;
  }

  public static mapFromJson(json: object): Image {
    return new Image(
      json.id,
      json.created_at,
      json.updated_at,
      json.url,
      json.description,
    );
  }
}