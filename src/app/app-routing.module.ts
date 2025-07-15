import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { DocumentDashboardComponent } from "./components/document-dashboard/document-dashboard.component";
import { EmployeeSectionComponent } from "./components/employee-section/employee-section.component";
import { LeaveSectionComponent } from "./components/leavesection/leavesection.component";
import { BirthdaysectionComponent } from "./components/birthdaysection/birthdaysection.component";
import { EditusersComponent } from "./components/editusers/editusers.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { ProfileOverviewComponent } from "./components/profile-overview/profile-overview.component";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "document-dashboard",
    component: DocumentDashboardComponent,
  },
  {
    path: "leavesection",
    component: LeaveSectionComponent,
  },
  {
    path: "document",
    component: EmployeeSectionComponent,
  },
  {
    path: "upcomingbithdays",
    component: BirthdaysectionComponent,
  },
  {
    path: "editusers",
    component: EditusersComponent,
  },
  {
    path: "profile",
    component: ProfileComponent,
  },
  {
    path: "profile-overview",
    component: ProfileOverviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
