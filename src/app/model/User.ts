class User {
id: number;
name: string;
updatedAt: Date;
role: string;
avatarUrl: string;

constructor(id: number, name: string, updatedAt: Date, role: string, avatarUrl: string) {
  this.id = id;
  this.name = name;
  this.updatedAt = updatedAt;
  this.role = role;
  this.avatarUrl = avatarUrl;
}
}