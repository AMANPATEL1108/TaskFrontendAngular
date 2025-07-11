import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id?: number;
  _id?: number; // Added for MongoDB-style IDs
  name: string;
  description: string;
  imageUrl?: string;
  assignedTo: string | { username: string }; // Allows both string or object
  endDate: string;
  priority: string;
  status: string;
  userId?: number;
  taskMenuId?: number;
}

export interface TaskMenu {
  idd:number;
  id?: number;
  _id?: number; // Added for MongoDB-style IDs
  name: string;
  tasks: Task[];


}

@Injectable({ providedIn: 'root' })
export class TaskMenuService {
  private baseUrl = 'http://localhost:8080/taskmenu';

  constructor(private http: HttpClient) {}

  // GET all task menus with their tasks
  getAll(): Observable<TaskMenu[]> {
    return this.http.get<TaskMenu[]>(`${this.baseUrl}/get-all-taskmenu`);
  }

  // POST a new task to a specific task menu
  addTaskToMenu(formData: FormData): Observable<Task> {
    return this.http.post<Task>('http://localhost:8080/tasks/create', formData);
  }

  createTaskMenu(data: { name: string }): Observable<TaskMenu> {
    return this.http.post<TaskMenu>('http://localhost:8080/taskmenu/create', data);
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/tasks/${taskId}`);
  }

  deleteTaskMenu(menuId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/taskmenu/deletetaskmenu/${menuId}`, {
      responseType: 'text'  // 👈 this tells Angular not to expect JSON
    });
  }



  // // Update task order
  updateTaskMenu(menuId: number, tasks: Task[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-order/${menuId}`, tasks);
  }


  moveTaskToNewList(taskId: number, newMenuId: number): Observable<any> {
    return this.http.put(`http://localhost:8080/tasks/move/${taskId}`, { newMenuId }, { responseType: 'json' });
  }



}
