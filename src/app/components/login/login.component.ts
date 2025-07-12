import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthServiceService } from "../../services/auth-service.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginForm: FormGroup;
  userForm: FormGroup;
  submitted = false;
  loginMessage = "";
  showLoginModel = true;
  showRegisterModel = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

    this.userForm = this.fb.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        address: [""],
        city: [""],
        state: [""],
        country: [""],
        dob: ["", Validators.required],
        userName: ["", Validators.required],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
            ),
          ],
        ],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  showLogin() {
    this.showLoginModel = true;
    this.showRegisterModel = false;
  }

  showRegister() {
    this.showLoginModel = false;
    this.showRegisterModel = true;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (res) => {
        if (res.token) {
          this.loginMessage = "Login successful!";
          this.router.navigate(["/home"]);
        } else {
          this.loginMessage = "Invalid username or password";
        }
      },
      error: (err) => {
        this.loginMessage = "Server error occurred";
        console.error(err);
      },
    });
  }

  onRegister(): void {
    if (this.userForm.invalid) {
      if (this.userForm.errors?.["passwordMismatch"]) {
        alert("Passwords do not match.");
      }
      return;
    }

    const formValue = this.userForm.value;

    const userJson = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      address: formValue.address,
      city: formValue.city,
      state: formValue.state,
      country: formValue.country,
      dateofbirth: formValue.dob,
      username: formValue.userName,
      password: formValue.password,
      age: this.calculateAge(formValue.dob),
      role: "EMPLOYEE",
    };

    const formData = new FormData();
    formData.append(
      "user",
      new Blob([JSON.stringify(userJson)], { type: "application/json" })
    );

    if (this.selectedFile) {
      formData.append("file", this.selectedFile);
    }

    this.http.post("http://localhost:8080/users/create", formData).subscribe({
      next: () => {
        this.userForm.reset();
        this.selectedFile = null;
        this.showLogin();
      },
      error: (err) => {
        alert("Registration failed");
        console.error(err);
      },
    });
  }

  calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log("Selected file:", file);
    }
  }

  // ✅ Custom validator to check if password === confirmPassword
  private passwordsMatchValidator(
    form: AbstractControl
  ): ValidationErrors | null {
    const password = form.get("password")?.value;
    const confirmPassword = form.get("confirmPassword")?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }
}
