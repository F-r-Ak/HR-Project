import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  setItem(key: string, value: string) {
    return of(localStorage.setItem(key, value));
  }

  getItemObservable(key: string) {
    return of(localStorage.getItem(key));
  }

  getItem(key: string) {
    return localStorage.getItem(key);
  }

  getUserData(key: string) {
    return localStorage.getItem(key);
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }
  getTokenFromSessionStorage() {
    return sessionStorage.getItem('token');
  }

  clearStorage() {
    return of(localStorage.clear());
  }
  clearSessionStorage() {
    return of(sessionStorage.clear());
  }
}
