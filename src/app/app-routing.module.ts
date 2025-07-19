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
import { AccessDeniedComponent } from "./access-denied/access-denied.component";
import { AdminGuard } from "./guards/admin.guard";
import { SharedGuard } from "./guards/shared.guard";
import { UserGuard } from "./guards/user.guard";

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
    canActivate: [AdminGuard],
  },
  {
    path: "leavesection",
    component: LeaveSectionComponent,
    canActivate: [SharedGuard],
  },
  {
    path: "document",
    component: EmployeeSectionComponent,
    canActivate: [UserGuard],
  },
  {
    path: "upcomingbithdays",
    component: BirthdaysectionComponent,
    canActivate: [SharedGuard],
  },
  {
    path: "editusers",
    component: EditusersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [SharedGuard],
  },
  {
    path: "profile-overview",
    component: ProfileOverviewComponent,
    canActivate: [SharedGuard],
  },
  { path: "access-denied", component: AccessDeniedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
