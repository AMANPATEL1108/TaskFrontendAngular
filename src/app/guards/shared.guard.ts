// src/app/guards/shared.guard.ts
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthServiceService } from "../services/auth-service.service";

@Injectable({
  providedIn: "root",
})
export class SharedGuard implements CanActivate {
  constructor(private auth: AuthServiceService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(["/login"]);
      return false;
    }

    if (!(this.auth.isAdmin() || this.auth.isUser())) {
      this.router.navigate(["/access-denied"]);
      return false;
    }

    return true;
  }
}
