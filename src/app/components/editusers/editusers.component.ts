import { Component, OnInit } from "@angular/core";
import { AuthServiceService } from "../../services/auth-service.service";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";

interface User {
  id: number;
  username: string;
  role: string;
  dateofbirth: string;
  firstName: string;
  lastName: string;
}

@Component({
  selector: "app-editusers",
  templateUrl: "./editusers.component.html",
  styleUrls: ["./editusers.component.css"],
})
export class EditusersComponent implements OnInit {
  users: User[] = [];
  showRegisterModel = false;
  editUserForm: FormGroup;
  userForm: FormGroup;
  targetUser: User | null = null;
  selectedFile: File | null = null;

  editModalOpen = false;
  deleteModalOpen = false;

  constructor(
    private toastr: ToastrService,
    public authService: AuthServiceService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.editUserForm = this.fb.group({
      id: [],
      firstName: this.fb.control({ value: "", disabled: true }),
      lastName: this.fb.control({ value: "", disabled: true }),
      username: this.fb.control(
        { value: "", disabled: true },
        Validators.required
      ),
      role: ["", Validators.required],
      dateofbirth: this.fb.control({ value: "", disabled: true }),
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
  captchaToken: string | null = null;
  captchaError: boolean = false;

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

  private passwordsMatchValidator(
    form: AbstractControl
  ): ValidationErrors | null {
    const password = form.get("password")?.value;
    const confirmPassword = form.get("confirmPassword")?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  ngOnInit() {
    this.loadAll();
  }

  get f() {
    return this.editUserForm.controls;
  }

  loadAll() {
    this.http
      .get<User[]>("http://localhost:8080/admin/get-all-users")
      .subscribe((users) => (this.users = users));
  }

  openEdit(user: User) {
    this.targetUser = user;
    this.editUserForm.patchValue({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
      dateofbirth: user.dateofbirth,
    });
    this.editModalOpen = true;
  }

  submitEdit() {
    if (this.editUserForm.invalid) return;

    const updated = {
      id: this.editUserForm.get("id")?.value,
      username: this.editUserForm.get("username")?.value,
      role: this.editUserForm.get("role")?.value,
      dateofbirth: this.editUserForm.get("dateofbirth")?.value,
    };

    this.http
      .put(
        `http://localhost:8080/admin/updateById-usserrights/${updated.id}`,
        updated,
        {
          responseType: "text" as "json",
        }
      )
      .subscribe({
        next: () => {
          this.toastr.success("User updated successfully");
          this.editModalOpen = false;
          this.loadAll();
        },
        error: (err) => {
          console.error("Update failed:", err);
          this.toastr.error("Failed to update user");
        },
      });
  }

  onRegister(): void {
    if (this.userForm.invalid) {
      const errorMessage = this.userForm.errors?.["passwordMismatch"]
        ? "Passwords do not match."
        : "Please complete the form correctly.";
      this.toastr.error(errorMessage);
      return;
    }

    const formValue = this.userForm.value;

    // Build the user DTO object to match the backend expectations
    const userDto = {
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
      role: "USER",
      captchaToken: this.captchaToken || "",
    };

    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append(
      "user", // This must match @RequestPart("user") in Spring controller
      new Blob([JSON.stringify(userDto)], { type: "application/json" })
    );

    if (this.selectedFile) {
      formData.append("file", this.selectedFile);
    }

    this.http.post("http://localhost:8080/admin/register", formData).subscribe({
      next: () => {
        this.toastr.success("User registered successfully!");
        this.userForm.reset();
        this.selectedFile = null;
        this.captchaToken = null;
        this.closeRegisterModel();
        this.loadAll();
      },
      error: (err) => {
        console.error("Registration error:", err);
        this.toastr.error("Registration failed. Please try again.");
      },
    });
  }

  openDelete(user: User) {
    this.targetUser = user;
    this.deleteModalOpen = true;
  }

  confirmDelete(): void {
    if (!this.targetUser) return;

    const userId = this.targetUser.id;
    const token = localStorage.getItem("authToken");

    if (!token) {
      this.toastr.error("You are not authenticated.");
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .delete(`http://localhost:8080/admin/deleteById/${userId}`, {
        headers: headers,
        responseType: "text" as "json", // correct type for plain text response
      })
      .subscribe({
        next: () => {
          this.toastr.success("✅ User deleted successfully");
          this.loadAll(); // refresh user list
          this.deleteModalOpen = false;
        },
        error: (err) => {
          console.error("❌ Delete failed:", err);
          this.toastr.error("Failed to delete user");
        },
      });
  }

  cancelEdit() {
    this.editModalOpen = false;
    this.targetUser = null;
    this.editUserForm.reset();
  }

  cancelDelete() {
    this.deleteModalOpen = false;
    this.targetUser = null;
  }

  openRegisterModel() {
    this.showRegisterModel = true;
  }
  closeRegisterModel() {
    this.showRegisterModel = false;
  }
}
