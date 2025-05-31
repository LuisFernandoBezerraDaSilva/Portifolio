import { BaseService } from "./baseService";
import { AuthCredentials } from "../interfaces/auth";

export class AuthService extends BaseService<any> {
  constructor() {
    super("auth");
  }

  async login(credentials: AuthCredentials) {
    return this.create(credentials, "auth/login");
  }
}