import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private tokenKey: string = 'authToken';
  private userIdKey: string = 'userId';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  setUserId(userId: number): void {
    localStorage.setItem(this.userIdKey, userId.toString());
  }

  getUserId(): string | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId;
  }

  clearUserId(): void {
    localStorage.removeItem(this.userIdKey);
  }

  clearAll(): void {
    this.clearToken();
    this.clearUserId();
  }
}