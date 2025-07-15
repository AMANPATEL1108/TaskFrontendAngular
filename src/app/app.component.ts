import { AfterViewInit, Component } from "@angular/core";
import { AuthServiceService } from "./services/auth-service.service";
import { Router } from "@angular/router";
declare var bootstrap: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements AfterViewInit {
  title = "projectA";
  constructor(public authService: AuthServiceService, public router: Router) {}

  showHeader(): boolean {
    const isLoggedIn = this.authService.getUserId() !== null;
    const isProfileOverview = this.router.url === "/profile-overview";
    return isLoggedIn && !isProfileOverview;
  }   

  ngAfterViewInit(): void {
    const dropdownElementList = [].slice.call(
      document.querySelectorAll(".dropdown-toggle")
    );
    dropdownElementList.map(
      (dropdownToggleEl) => new bootstrap.Dropdown(dropdownToggleEl)
    );
  }
}
