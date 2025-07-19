import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { jwtDecode } from "jwt-decode";

interface LoginResponse {
  token: string;
  role: string; // e.g., "ADMIN" or "USER"
  userId: number;
}

@Injectable({
  providedIn: "root",
})
export class AuthServiceService {
  private baseUrl = "http://localhost:8080/auth";
  public userImageUrl: string = "";

  constructor(private http: HttpClient) {}

  // Add Authorization header
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("authToken");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, { username, password })
      .pipe(
        map((response) => {
          if (
            response.token &&
            response.role &&
            response.userId !== undefined
          ) {
            localStorage.setItem("authToken", response.token);
            localStorage.setItem("userRole", `ROLE_${response.role}`); // Normalize
            localStorage.setItem("userId", response.userId.toString());
          }
          return response;
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  getRole(): string | null {
    return localStorage.getItem("userRole");
  }

  getUserId(): number | null {
    const id = localStorage.getItem("userId");
    return id ? Number(id) : null;
  }

  // Role checks
  isAdmin(): boolean {
    return this.getRole() === "ROLE_ADMIN";
  }

  isUser(): boolean {
    return this.getRole() === "ROLE_USER";
  }

  isEmployee(): boolean {
    return this.getRole() === "ROLE_EMPLOYEE";
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    this.userImageUrl = "";
  }

  // ⬅️ Updated to send token in header
  fetchUserProfileImage(): void {
    const userId = this.getUserId();
    if (userId) {
      this.http
        .get<{ imageUrl: string }>(
          `http://localhost:8080/users/${userId}/profile-image`,
          {
            headers: this.getAuthHeaders(),
          }
        )
        .subscribe({
          next: (res) => {
            this.userImageUrl = res.imageUrl;
          },
          error: (err) => {
            console.error("Failed to fetch user profile image", err);
            this.userImageUrl = "assets/default-profile.png";
          },
        });
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error("Invalid token", e);
      return null;
    }
  }

  hasRole(role: string): boolean {
    const decoded = this.getDecodedToken();
    return decoded?.role === role || this.getRole() === role;
  }
}
