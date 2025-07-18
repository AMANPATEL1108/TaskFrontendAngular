import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

export interface User {
  id: number;
  username: string;
  // other user fields
}

export interface TaskDTO {
  name: string;
  description: string;
  priority: string;
  endDate: string;
  imageUrl?: string;
  userId: number; // assigned user id
  taskMenuId: number; // linked task menu id
}

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private baseUrl = "http://localhost:8080";

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("authToken");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/user/get-all-users`, {
      headers: this.getAuthHeaders(),
    });
  }

  createTask(task: TaskDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/create-task`, task, {
      headers: this.getAuthHeaders(),
    });
  }
}
