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

  it('should set and get user ID', () => {
    const userId = 123;
    service.setUserId(userId);
    expect(service.getUserId()).toBe('123');
    expect(localStorage.setItem).toHaveBeenCalledWith('userId', '123');
  });

  it('should clear token', () => {
    service.setToken('test-token');
    service.clearToken();
    expect(service.getToken()).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
  });

  it('should clear user ID', () => {
    service.setUserId(123);
    service.clearUserId();
    expect(service.getUserId()).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('userId');
  });

  it('should clear all data', () => {
    service.setToken('test-token');
    service.setUserId(123);
    service.clearAll();
    expect(service.getToken()).toBeNull();
    expect(service.getUserId()).toBeNull();
  });

  it('should return null when token does not exist', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should return null when user ID does not exist', () => {
    expect(service.getUserId()).toBeNull();
  });
});
