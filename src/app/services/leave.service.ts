import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Leave} from "../components/leavesection/leave.model";

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private baseUrl = 'http://localhost:8080/leave';  // Your backend base URL

  constructor(private http: HttpClient) {}

  // CREATE
  createLeave(leave: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/createleave`, leave, { responseType: 'text' });
  }


  // READ - All leaves
  getAllLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.baseUrl}/get-all-leaves`);
  }

  // READ - By ID
  getLeaveById(id: number): Observable<Leave> {
    return this.http.get<Leave>(`${this.baseUrl}/get-leave-ById/${id}`);
  }

  // UPDATE
  updateLeaveById(id: number, leave: Leave): Observable<string> {
    return this.http.put(`${this.baseUrl}/updateById/${id}`, leave, { responseType: 'text' });
  }

  // DELETE
  deleteLeaveById(id: number | undefined): Observable<string> {
    return this.http.delete(`${this.baseUrl}/leaveDeleteById/${id}`, { responseType: 'text' });
  }
}
