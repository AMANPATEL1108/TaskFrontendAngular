import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { Leave } from "../components/leavesection/leave.model";

@Injectable({
  providedIn: "root",
})
export class LeaveService {
  private baseUrl = "http://localhost:8080/user/leave";

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("authToken");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  createLeave(leave: any): Observable<string> {
    return this.http.post(`http://localhost:8080/user/createleave`, leave, {
      headers: this.getAuthHeaders(),
      responseType: "text",
    });
  }

  getAllLeaves(): Observable<Leave[]> {
    return this.http
      .get<Leave[]>(`http://localhost:8080/basic/get-all-leaves`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => {
          console.log("API Response:", response);
        })
      );
  }

  getLeaveById(id: number): Observable<Leave> {
    return this.http.get<Leave>(
      `http://localhost:8080/user/get-leave-ById/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  updateLeaveById(id: number, leave: Leave): Observable<string> {
    return this.http.put(
      `http://localhost:8080/basic/updateById-leave/${id}`,
      leave,
      {
        headers: this.getAuthHeaders(),
        responseType: "text",
      }
    );
  }

  deleteLeaveById(id: number | undefined): Observable<string> {
    return this.http.delete(
      `http://localhost:8080/user/leaveDeleteById/${id}`,
      {
        headers: this.getAuthHeaders(),
        responseType: "text",
      }
    );
  }
}
