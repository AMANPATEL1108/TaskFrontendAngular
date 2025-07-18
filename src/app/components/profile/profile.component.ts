import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";

declare var bootstrap: any;

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  selectedFile: File | null = null;
  userId!: number;
  userData: any;
  userImageUrl: string = "";
  defaultImageUrl: string = "assets/images/default-profile.png";

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    const id = localStorage.getItem("userId");
    if (id) {
      this.userId = +id;
    }

    this.profileForm = this.fb.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        address: [""],
        city: [""],
        state: [""],
        country: [""],
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: [""],
      },
      { validators: this.passwordsMatch }
    );

    this.loadUserData();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("authToken");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  passwordsMatch(group: AbstractControl): { [key: string]: boolean } | null {
    const pass = group.get("password")?.value;
    const confirm = group.get("confirmPassword")?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  loadUserData(): void {
    if (this.userId) {
      this.http
        .get<any>(`http://localhost:8080/users/findById/${this.userId}`, {
          headers: this.getAuthHeaders(),
        })
        .subscribe((data) => {
          this.userData = data;

          this.profileForm.patchValue({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
          });

          this.userImageUrl = data.imageUrl
            ? `http://localhost:8080${data.imageUrl}`
            : this.defaultImageUrl;

          console.log("User image URL:", this.userImageUrl);
        });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  openEditModal(): void {
    const modalElement = document.getElementById("editModal");
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById("editModal");
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }

  onUpdateProfile(): void {
    const userPayload = {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      email: this.profileForm.value.email,
      address: this.profileForm.value.address,
      city: this.profileForm.value.city,
      state: this.profileForm.value.state,
      country: this.profileForm.value.country,
      password: this.profileForm.value.password,
      confirmPassword: this.profileForm.value.confirmPassword,
    };

    const formData = new FormData();
    formData.append(
      "user",
      new Blob([JSON.stringify(userPayload)], { type: "application/json" })
    );

    if (this.selectedFile) {
      formData.append("file", this.selectedFile);
    }

    this.http
      .put(`http://localhost:8080/users/updateById/${this.userId}`, formData, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: () => {
          alert("✅ Profile updated successfully!");
          this.closeModal();
          this.loadUserData();
        },
        error: (error) => {
          console.error("Update failed", error);
          alert("❌ Failed to update profile!");
        },
      });
  }
}
