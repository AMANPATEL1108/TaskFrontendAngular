import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { AuthServiceService } from "../../services/auth-service.service";
declare var bootstrap: any;

@Component({
  selector: "app-document-dashboard",
  templateUrl: "./document-dashboard.component.html",
})
export class DocumentDashboardComponent implements OnInit {
  documents: any[] = [];
  newDocument: any = {};
  selectedFile: File | null = null;
  fileTouched = false;
  editMode = false;
  deleteTarget: any = null;
  deleteModal: any;

  constructor(
    private toastr: ToastrService,
    protected authService: AuthServiceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.deleteModal = new bootstrap.Modal(
      document.getElementById("deleteConfirmModal")
    );
  }

  loadAll(): void {
    this.http.get<any[]>("http://localhost:8080/person/get-all").subscribe({
      next: (data) => {
        this.documents = data;
      },
      error: () => {
        this.toastr.error("Failed to load documents", "Error");
      }
    });
  }

  openAdd(): void {
    this.editMode = false;
    this.newDocument = {};
    this.selectedFile = null;
    this.fileTouched = false;
    new bootstrap.Modal(
      document.getElementById("addDocumentModal")
    ).show();
  }

  openEdit(doc: any): void {
    this.editMode = true;
    this.newDocument = { ...doc };
    this.selectedFile = null;
    this.fileTouched = false;
    new bootstrap.Modal(
      document.getElementById("addDocumentModal")
    ).show();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.fileTouched = true;
    if (file && file.type === "application/pdf") {
      this.selectedFile = file;
    } else {
      alert("Only PDF files are allowed.");
      this.selectedFile = null;
      event.target.value = "";
    }
  }

  submitDocument(): void {
    const url = this.editMode
      ? `http://localhost:8080/person/updateById/${this.newDocument.id}`
      : `http://localhost:8080/person/create`;

    const form = new FormData();
    form.append("person", new Blob([JSON.stringify(this.newDocument)], { type: "application/json" }));
    if (this.selectedFile) form.append("file", this.selectedFile);

    const request$ = this.editMode ? this.http.put(url, form) : this.http.post(url, form);

    request$.subscribe({
      next: () => {
        this.toastr.success(
          this.editMode ? "Document updated successfully" : "Document added successfully",
          "Success"
        );
        this.loadAll();
        bootstrap.Modal.getInstance(document.getElementById("addDocumentModal"))?.hide();
      },
      error: () => {
        this.toastr.error("Failed to save document", "Error");
      }
    });
  }

  confirmDelete(doc: any): void {
    this.deleteTarget = doc;
    this.deleteModal.show();
  }

  deleteDocument(): void {
    this.http.delete(`http://localhost:8080/person/deleteByID/${this.deleteTarget.id}`).subscribe({
      next: () => {
        this.toastr.success("Document deleted successfully", "Success");
        this.loadAll();
        this.deleteModal.hide();
      },
      error: () => {
        this.toastr.error("Failed to delete document", "Error");
      }
    });
  }
}


