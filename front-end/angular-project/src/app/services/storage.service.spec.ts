import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    mockLocalStorage = {};
    
    spyOn(localStorage, 'getItem').and.callFake((key: string) => mockLocalStorage[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => mockLocalStorage[key] = value);
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => delete mockLocalStorage[key]);

    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get token', () => {
    const token = 'test-token';
    service.setToken(token);
    expect(service.getToken()).toBe(token);
    expect(localStorage.setItem).toHaveBeenCalledWith('authToken', token);
  });

  it('should clear token', () => {
    service.setToken('test-token');
    service.clearToken();
    expect(service.getToken()).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
  });

  it('should clear all data', () => {
    service.setToken('test-token');
    service.clearAll();
    expect(service.getToken()).toBeNull();
  });

  it('should return null when token does not exist', () => {
    expect(service.getToken()).toBeNull();
  });
});
