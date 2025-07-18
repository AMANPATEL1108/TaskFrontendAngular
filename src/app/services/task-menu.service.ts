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
}

@Injectable({ providedIn: "root" })
export class TaskMenuService {
  private baseUrl = "http://localhost:8080/user/taskmenu";

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("authToken");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAll(): Observable<TaskMenu[]> {
    return this.http.get<TaskMenu[]>(`${this.baseUrl}/get-all-taskmenu`, {
      headers: this.getAuthHeaders(),
    });
  }

  addTaskToMenu(formData: FormData): Observable<Task> {
    return this.http.post<Task>(
      "http://localhost:8080/admin/create-task",
      formData,
      { headers: this.getAuthHeaders() }
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
      `http://localhost:8080/admin/update-order/${menuId}`,
      tasks,
      { headers: this.getAuthHeaders() }
    );
  }

  moveTaskToNewList(taskId: number, newMenuId: number): Observable<any> {
    return this.http.put(
      `http://localhost:8080/admin/move/${taskId}`,
      { newMenuId },
      {
        headers: this.getAuthHeaders(),
        responseType: "json",
      }
    );
  }
}
