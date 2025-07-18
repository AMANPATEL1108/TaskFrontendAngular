import { Component, OnInit } from "@angular/core";
import { AuthServiceService } from "../../services/auth-service.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
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
  editUserForm: FormGroup;
  targetUser: User | null = null;

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
      .put(`http://localhost:8080/users/updateById/${updated.id}`, updated, {
        responseType: "text" as "json",
      })
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

  openDelete(user: User) {
    this.targetUser = user;
    this.deleteModalOpen = true;
  }

  confirmDelete() {
    if (!this.targetUser) return;

    this.http
      .delete(`http://localhost:8080/admin/deleteById/${this.targetUser.id}`, {
        responseType: "text" as "json",
      })
      .subscribe({
        next: () => {
          this.toastr.success("User deleted successfully");
          this.loadAll();
          this.deleteModalOpen = false;
          this.targetUser = null;
        },
        error: (err) => {
          console.error("Delete failed:", err);
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
}
