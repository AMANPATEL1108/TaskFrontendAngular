// auth-service.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";

interface LoginResponse {
  token: string;
  role: string;
  userId: number;
}

@Injectable({
  providedIn: "root",
})
export class AuthServiceService {
  private baseUrl = "http://localhost:8080/auth";
  public userImageUrl: string = ""; // ✅ holds the profile image URL

  constructor(private http: HttpClient) {}

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
            localStorage.setItem("userRole", response.role);
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

  isAdmin(): boolean {
    return this.getRole() === "ROLE_ADMIN";
  }

  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    this.userImageUrl = ""; // ✅ clear image on logout
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isEmployye(): boolean {
    return this.getRole() === "ROLE_EMPLOYEE";
  }

  getUserId(): number | null {
    const id = localStorage.getItem("userId");
    return id ? Number(id) : null;
  }

  // ✅ Fetch profile image from backend using user ID
  fetchUserProfileImage(): void {
    const userId = this.getUserId();
    if (userId) {
      this.http
        .get<{ imageUrl: string }>(
          `http://localhost:8080/users/${userId}/profile-image`
        )
        .subscribe({
          next: (res) => {
            this.userImageUrl = res.imageUrl;
          },
          error: (err) => {
            console.error("Failed to fetch user profile image", err);
            this.userImageUrl = "assets/default-profile.png"; // fallback
          },
        });
    }
  }
}
