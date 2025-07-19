import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-access-denied",
  templateUrl: "./access-denied.component.html",
  styleUrls: ["./access-denied.component.css"],
})
export class AccessDeniedComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem("authToken");

    // Delay 2 seconds before redirecting to show the message
    setTimeout(() => {
      if (token) {
        this.router.navigate(["/home"]);
      } else {
        this.router.navigate(["/login"]);
      }
    }, 2000);
  }
}
