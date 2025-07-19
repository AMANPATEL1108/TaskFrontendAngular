import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Task {
  id?: number;
  _id?: number;
  name: string;
  description: string;
  imageUrl?: string;
  assignedTo: string | { username: string };
  endDate: string;
  priority: string;
  status: string;
  userId?: number;
  taskMenuId?: number;
}

export interface TaskMenu {
  idd: number;
  id?: number;
  _id?: number;
  name: string;
  tasks: Task[];
  datacon: any;
}

@Injectable({ providedIn: "root" })
export class TaskMenuService {
  private baseUrl = "http://localhost:8080";

  constructor(private http: HttpClient) {
    console.log("This is all data menu:", this.getAll);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("authToken");
    console.log("Token Retrieved:", token);

    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  getAll(): Observable<TaskMenu[]> {
    console.log("Token Finded", this.getAuthHeaders());
    return this.http.get<TaskMenu[]>(
      `${this.baseUrl}/basic/get-all-taskmenu`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  addTaskToMenu(formData: FormData): Observable<Task> {
    console.log("Data from Atsk create", formData);
    return this.http.post<Task>(
      "http://localhost:8080/admin/create-task",
      formData,
      {
        headers: this.getAuthHeaders(),
        withCredentials: true, // ✅ Optional, if you're also using cookies
      }
    );
  }

  createTaskMenu(data: { name: string }): Observable<TaskMenu> {
    return this.http.post<TaskMenu>(
      "http://localhost:8080/admin/create-task-menu",
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(
      `http://localhost:8080/admin/delete-task/${taskId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteTaskMenu(menuId: number): Observable<any> {
    return this.http.delete(
      `http://localhost:8080/admin/deletetaskmenu/${menuId}`,
      {
        headers: this.getAuthHeaders(),
        responseType: "text",
      }
    );
  }

  updateTaskMenu(menuId: number, tasks: Task[]): Observable<any> {
    return this.http.put(
      `http://localhost:8080/basic/update-order/${menuId}`,
      tasks,
      { headers: this.getAuthHeaders() }
    );
  }

  moveTaskToNewList(taskId: number, newMenuId: number): Observable<any> {
    return this.http.put(
      `http://localhost:8080/basic/move/${taskId}`,
      { newMenuId },
      {
        headers: this.getAuthHeaders(),
        responseType: "json",
      }
    );
  }
}
