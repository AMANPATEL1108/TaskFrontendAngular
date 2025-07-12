import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Leave } from "../components/leavesection/leave.model";

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private baseUrl = 'http://localhost:8080/leave';

  constructor(private http: HttpClient) {}

  createLeave(leave: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/createleave`, leave, { responseType: 'text' });
  }

  getAllLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.baseUrl}/get-all-leaves`).pipe(
      tap(response => {
        console.log('API Response:', response);
      })
    );
  }

  getLeaveById(id: number): Observable<Leave> {
    return this.http.get<Leave>(`${this.baseUrl}/get-leave-ById/${id}`);
  }

  updateLeaveById(id: number, leave: Leave): Observable<string> {
    return this.http.put(`${this.baseUrl}/updateById/${id}`, leave, { responseType: 'text' });
  }

  deleteLeaveById(id: number | undefined): Observable<string> {
    return this.http.delete(`${this.baseUrl}/leaveDeleteById/${id}`, { responseType: 'text' });
  }
}
