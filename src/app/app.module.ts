import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TaskComponent } from './model/task/task.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthInterceptor } from "./services/auth.interceptor";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { HomeComponent } from "./components/home/home.component";
import { DocumentDashboardComponent } from './components/document-dashboard/document-dashboard.component';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EmployeeSectionComponent } from './components/employee-section/employee-section.component';
import { SafeUrlPipe } from "./pipe/safe-url.pipe";
import { LeaveSectionComponent } from "./components/leavesection/leavesection.component";

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    DocumentDashboardComponent,
    EmployeeSectionComponent,
    SafeUrlPipe,
    LeaveSectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    DragDropModule,
    HomeComponent,
    MatSnackBarModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
