import { BaseService } from "./baseService";

export class AuthService extends BaseService<any> {
  constructor() {
    super("auth");
  }

  async login(credentials: { username: string; password: string }) {
    return this.create(credentials, "auth/login");
  }
}