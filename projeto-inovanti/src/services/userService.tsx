import { BaseService } from "./baseService";
import { User } from "../interfaces/user";

export class UserService extends BaseService<User> {
  constructor() {
    super("users");
  }

  async getAllUsers(): Promise<User[]> {
    return this.getAll();
  }

  async getUser(id: string): Promise<User> {
    return this.get(id);
  }

  async createUser(user: User): Promise<User> {
    return this.create(user, "auth/register");
  }

  async updateUser(id: string, user: User): Promise<User> {
    return this.update(id, user);
  }

  async deleteUser(id: string): Promise<void> {
    return this.delete(id);
  }
}