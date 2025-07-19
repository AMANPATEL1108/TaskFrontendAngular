import { Component } from "@angular/core";
import { AuthServiceService } from "../../services/auth-service.service";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-employee-section",
  templateUrl: "./employee-section.component.html",
  styleUrls: ["./employee-section.component.css"],
})
export class EmployeeSectionComponent {
  documents: any[] = [];
  selectedDocument: any = null; // selected doc for sidebar view

  constructor(
    private toastr: ToastrService,
    public authService: AuthServiceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.http
      .get<any[]>("http://localhost:8080/basic/get-all-persons")
      .subscribe({
        next: (data) => {
          this.documents = data;
        },
        error: () => {
          this.toastr.error("Failed to load documents", "Error");
        },
      });
  }

  viewDocuments(doc: any) {
    const fullPath = doc.pdfUrl;

    if (!fullPath) {
      this.toastr.error("No document file path available");
      return;
    }

    // ✅ Fix: Extract filename safely (cross-platform)
    const fileName = fullPath.replace(/^.*[\\\/]/, "");

    // ✅ Correct backend view URL
    doc.pdfUrlApi = `http://localhost:8080/user/document/view?filename=${encodeURIComponent(
      fileName
    )}`;

    this.selectedDocument = doc;
  }

  closeSidebar() {
    this.selectedDocument = null; // close sidebar
  }
}
