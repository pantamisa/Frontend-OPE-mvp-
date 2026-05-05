import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserRegistration } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/token/`, { username, password })
      .pipe(
        tap(response => {
          if (response.access) {
            localStorage.setItem('access_token', response.access);
          }
          if (response.refresh) {
            localStorage.setItem('refresh_token', response.refresh);
          }
        })
      );
  }

  register(userData: UserRegistration): Observable<any> {
    // Intentamos con /api/users/ como sugieren las instrucciones de Django
    return this.http.post<any>(`${this.apiUrl}/users/`, userData);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}
