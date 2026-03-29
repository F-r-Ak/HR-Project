// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Permission {
  name: string;
  value: string;
}

export interface ModulePage {
  page: string;
  pagePermissions: string;
}

export interface Module {
  label: string;
  pages?: ModulePage[];
  items?: ModulePage[]; // for backwards compatibility with older responses
}

export interface UserData {
  data: {
    id: string;
    name: string;
    role: string;
    organizationId: string;
    modules: Module[];
    permissions: Permission[];
  };
  status: string;
  message: string;
  exception: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://your-api.com/auth';
  private jwtHelper = new JwtHelperService();
  private userDataSubject = new BehaviorSubject<UserData | null>(null);
  private readonly USER_DATA_KEY = 'userData';

  // Observable to listen to user data changes
  userData$ = this.userDataSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Load user data on initialization
    this.loadUserData();
  }

  /**
   * Load user data from localStorage
   */
  private loadUserData(): void {
    try {
      const storedData = localStorage.getItem(this.USER_DATA_KEY);
      if (storedData) {
        const userData = JSON.parse(storedData);
        this.userDataSubject.next(userData);
      }
    } catch (error) {
      console.error('Failed to load user data', error);
      this.clearUserData();
    }
  }

  /**
   * Save user data to localStorage
   */
  private saveUserData(userData: UserData): void {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    this.userDataSubject.next(userData);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  /**
   * Set user data after login
   */
  setUserData(userData: UserData): void {
    this.saveUserData(userData);
  }

  /**
   * Get user data synchronously
   */
  getUserData(): UserData | null {
    try {
      const storedData = localStorage.getItem(this.USER_DATA_KEY);
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error('Failed to get user data', error);
      return null;
    }
  }

  /**
   * Get user data as observable
   */
  getUserDataObservable(): Observable<UserData | null> {
    return this.userData$;
  }

  clearUserData(): void {
    localStorage.removeItem(this.USER_DATA_KEY);
    this.userDataSubject.next(null);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenData');
    localStorage.removeItem('organizationId');
    this.clearUserData();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getToken(): string | null {
    return localStorage.getItem('token') || localStorage.getItem('accessToken');
  }
}