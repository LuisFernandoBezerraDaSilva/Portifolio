import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService<any> {

  constructor(http: HttpClient) {
    super(http);
  }

  login(credentials: { username: string, password: string }) {
    return this.create('auth/login', credentials);
  }

  logout() {
    return this.create('logout', {});
  }
}