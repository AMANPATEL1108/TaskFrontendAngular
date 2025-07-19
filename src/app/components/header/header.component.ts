import { Component } from "@angular/core";
import { AuthServiceService } from "../../services/auth-service.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  profileForm!: FormGroup;
  selectedFile: File | null = null;
  userId!: number;
  userData: any;
  userImageUrl: string = "";
  defaultImageUrl: string = "assets/default.jpg";
  constructor(
    public authService: AuthServiceService,
    public router: Router,
    public http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]); // 👈 Redirect to /home
  }

  loadUserData(): void {
    const userId = localStorage.getItem("userId");

    if (userId) {
      this.http
        .get<any>(`http://localhost:8080/basic/findById/${userId}`)
        .subscribe({
          next: (data) => {
            this.userData = data;

            if (data.imageUrl) {
              // 👇 Construct full image URL
              this.userImageUrl = `http://localhost:8080${data.imageUrl}`;
              console.log("Loaded user image:", this.userImageUrl);
            } else {
              this.userImageUrl = this.defaultImageUrl;
              console.log("No image found, using default.");
            }
          },
          error: (err) => {
            console.error("Failed to load user data", err);
            this.userImageUrl = this.defaultImageUrl;
          },
        });
    } else {
      console.warn("No userId in localStorage");
      this.userImageUrl = this.defaultImageUrl;
    }
  }
}
