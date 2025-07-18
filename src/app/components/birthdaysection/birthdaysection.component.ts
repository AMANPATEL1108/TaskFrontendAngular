import { Component } from "@angular/core";
import { AuthServiceService } from "../../services/auth-service.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-birthdaysection",
  templateUrl: "./birthdaysection.component.html",
  styleUrls: ["./birthdaysection.component.css"],
})
export class BirthdaysectionComponent {
  upcomingBirthdays: any[] = [];

  constructor(
    private http: HttpClient,
    public authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.http
      .get<any[]>("http://localhost:8080/basic/upcoming-birthdays")
      .subscribe({
        next: (data) => {
          this.upcomingBirthdays = data;
        },
        error: (err) => {
          console.error("Failed to load birthdays", err);
        },
      });
  }
  isBirthdayToday(dob: Date): boolean {
    if (!dob) return false;
    const today = new Date();
    const date = new Date(dob);
    return (
      date.getDate() === today.getDate() && date.getMonth() === today.getMonth()
    );
  }
}
