// auth-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface LoginResponse {
  token: string;
  role: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {


  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { username, password }).pipe(
      map(response => {
        if (response.token && response.role) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userRole', response.role);
        }
        return response;
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isAdmin(): boolean {
    return this.getRole() === 'ROLE_ADMIN';
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
