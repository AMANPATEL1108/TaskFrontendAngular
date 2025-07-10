import { Injectable } from '@angular/core';
import {Task} from "../model/task/task.model";

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  private tasks: Task[] = [];

  getTasks(): Task[] { return this.tasks; }

  addTask(task: Task) {
    this.tasks.push(task);
  }

}
