import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<any> {

  constructor(http: HttpClient) {
    super(http); 
  }

  createUser(user: { username: string; password: string }) {
    return this.create('auth/register', user); 
  }
}