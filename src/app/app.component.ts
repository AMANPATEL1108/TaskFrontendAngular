import { AfterViewInit, Component } from "@angular/core";
import { AuthServiceService } from "./services/auth-service.service";
declare var bootstrap: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements AfterViewInit {
  title = "projectA";
  constructor(public authService: AuthServiceService) {}

  showHeader(): boolean {
    return this.authService.getUserId() !== null;
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
