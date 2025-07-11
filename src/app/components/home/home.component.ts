import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TaskMenuService, Task, TaskMenu } from '../../services/task-menu.service';
import { RouterLink } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {AuthServiceService} from "../../services/auth-service.service";

declare var bootstrap: any;

interface User {
  id: number;
  username: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgIf, RouterLink, DragDropModule, NgForOf, NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  taskMenus: TaskMenu[] = [];
  currentColumn!: TaskMenu;
  users: User[] = [];
  addUserForm: FormGroup;
  selectedTaskListIdToDelete: number | null = null;

  taskForm: FormGroup;
  addListForm: FormGroup;

  constructor(
    public authService: AuthServiceService,
    private svc: TaskMenuService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.taskForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      imageUrl: [''],
      assignedTo: ['', Validators.required],
      endDate: ['', Validators.required],
      priority: ['Medium', Validators.required],
      status: ['', Validators.required],
      imageFile: [null]
    });

    this.addUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['USER', Validators.required]
    });


    this.addListForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsersAndMenus();
  }

  loadUsersAndMenus(): void {
    this.http.get<User[]>('http://localhost:8080/users/get-all-users').subscribe({
      next: users => {
        this.users = users;
        this.loadTaskMenus();
      },
      error: err => {
        console.error('Failed to load users:', err);
        alert('Failed to load users. Please try again later.');
      }
    });
  }

  loadTaskMenus() {
    this.svc.getAll().subscribe({
      next: data => {
        this.taskMenus = data.map(menu => ({
          ...menu,
          id: menu.id ?? menu._id ?? 0,
          tasks: (menu.tasks ?? []).map(task => {
            const userId = task.userId ?? undefined;
            const user = this.users.find(u => u.id === userId);

            return {
              ...task,
              id: task.id ?? task._id ?? 0,
              assignedTo: user ? { username: user.username } : 'Unassigned',
              status: task.status || 'Not Started',
              userId: userId // ✅ This is now number or undefined
            };
          })
        }));
      },
      error: err => {
        console.error('Failed to load task menus:', err);
        alert('Failed to load task menus. Please try again later.');
      }
    });
  }



  createUser(): void {
    if (this.addUserForm.invalid) return;

    const newUser = this.addUserForm.value;

    this.http.post('http://localhost:8080/users/create', newUser).subscribe({
      next: (res) => {
        alert('User created successfully');
        const modalEl = document.getElementById('addUserModal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
        this.addUserForm.reset({ role: 'USER' });
        this.loadUsersAndMenus(); // refresh list
      },
      error: (err) => {
        console.error('Error creating user:', err);
        alert('Failed to create user');
      }
    });
  }


  openAddTaskModal(menu: TaskMenu): void {
    this.currentColumn = menu;

    this.taskForm.reset({
      status: menu.name,
      priority: 'Medium',
      assignedTo: '',
      name: '',
      description: '',
      endDate: '',
      imageUrl: ''
    });

    const modalEl = document.getElementById('taskModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
  }

  addTask(): void {
    if (this.taskForm.invalid || !this.currentColumn) return;

    const formData = new FormData();
    formData.append('name', this.taskForm.value.name);
    formData.append('description', this.taskForm.value.description || '');
    formData.append('priority', this.taskForm.value.priority);
    formData.append('endDate', this.taskForm.value.endDate);
    formData.append('userId', this.taskForm.value.assignedTo);
    formData.append('taskMenuId', this.currentColumn.id!.toString());
    formData.append('status', this.taskForm.value.status);

    if (this.taskForm.value.imageFile) {
      formData.append('imageFile', this.taskForm.value.imageFile);
    }

    this.svc.addTaskToMenu(formData).subscribe({
      next: (savedTask) => {
        const assignedUser = this.users.find(u => u.id === savedTask.userId);
        const normalizedTask: Task = {
          ...savedTask,
          id: savedTask.id ?? savedTask._id ?? 0,
          assignedTo: assignedUser?.username ?? 'Unknown',
          status: savedTask.status || 'Not Started'
        };

        this.currentColumn.tasks.push(normalizedTask);

        const modalEl = document.getElementById('taskModal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();

        this.taskForm.reset();
        this.clearImagePreview();
      },
      error: err => {
        console.error('Failed to add task:', err);
        alert('Error adding task. Please try again.');
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.taskForm.patchValue({ imageFile: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.taskForm.patchValue({ imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  clearImagePreview(): void {
    this.taskForm.patchValue({ imageUrl: '' });
  }

  createTaskList(): void {
    if (this.addListForm.invalid) return;
    const taskListData = this.addListForm.value;

    this.svc.createTaskMenu(taskListData).subscribe({
      next: (newList) => {
        let normalizedList: TaskMenu;
        normalizedList = {
          ...newList,
          id: newList.id ?? newList._id ?? 0,
          tasks: (newList.tasks ?? []).map(task => ({
            ...task,
            taskMenuId: newList.id ?? 0, // Ensure taskMenuId is added to each task
            id: task.id ?? task._id ?? 0,  // Ensure task id is valid
            assignedTo: task.userId
              ? { username: this.users.find(u => u.id === task.userId)?.username ?? 'Unknown' }
              : { username: 'Unknown' },
            status: task.status || 'Not Started', // Set default status if missing
          }))
        };

        // Push the new task menu to the list of task menus
        this.taskMenus.push(normalizedList);

        // Hide modal after adding
        const modalEl = document.getElementById('addListModal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();

        // Reset the form
        this.addListForm.reset();
      },
      error: err => {
        console.error('Failed to create task list:', err);
        alert('Error creating task list. Please try again.');
      }
    });
  }

  deleteTask(taskId: number | undefined, menuId: number | undefined) {
    if (taskId === undefined || menuId === undefined) {
      console.error('Task ID or Menu ID is undefined');
      return;
    }

    if (confirm('Are you sure you want to delete this task?')) {
      this.svc.deleteTask(taskId).subscribe({
        next: () => {
          const menu = this.taskMenus.find(m => m.id === menuId);
          if (menu) {
            menu.tasks = menu.tasks.filter(t => t.id !== taskId);
          }
        },
        error: (err) => {
          console.error('Failed to delete task:', err);
          alert('Failed to delete task');
        }
      });
    }
  }



  onTaskDrop(event: CdkDragDrop<Task[]>, targetMenu: TaskMenu) {
    const movedTask = event.item.data;
    const newMenuId = targetMenu.id;

    if (!movedTask || !newMenuId) {
      console.error('Missing task or target menu ID');
      return;
    }

    // Only move in the UI if the drop was within the same container
    if (event.previousContainer === event.container) {
      moveItemInArray(targetMenu.tasks, event.previousIndex, event.currentIndex);
    }

    this.http.put(`http://localhost:8080/tasks/move/${movedTask.id}`, { newMenuId })
      .subscribe({
        next: response => {
          console.log('Task moved successfully:', response);
          this.loadTaskMenus(); // Refresh menus and tasks
        },
        error: error => {
          console.error('Error updating task menu:', error);
          alert('Error moving task!');
        }
      });
  }







  getConnectedListIds(currentMenuId: number): string[] {
    return this.taskMenus
      .filter(m => m.id !== currentMenuId)
      .map(m => 'menu-' + m.id); // 🔧 Matches the [id] in template
  }

  getAssignedToName(assignedTo: string | { username: string } | null | undefined): string {
    if (!assignedTo) return 'Unassigned';

    if (typeof assignedTo === 'object' && 'username' in assignedTo) {
      return assignedTo.username;
    }

    if (typeof assignedTo === 'string') {
      const userId = Number(assignedTo);
      if (!isNaN(userId)) {
        const user = this.users.find(u => u.id === userId);
        return user ? user.username : 'Unassigned';
      }
      return assignedTo; // fallback
    }

    return 'Unassigned';
  }

  openDeleteConfirmation(menuId: number): void {
    this.selectedTaskListIdToDelete = menuId;
    const modalEl = document.getElementById('confirmDeleteListModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
  }

  confirmDeleteTaskList(): void {
    if (this.selectedTaskListIdToDelete !== null) {
      this.svc.deleteTaskMenu(this.selectedTaskListIdToDelete).subscribe({
        next: () => {
          this.taskMenus = this.taskMenus.filter(menu => menu.id !== this.selectedTaskListIdToDelete);
          const modalEl = document.getElementById('confirmDeleteListModal');
          if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
          this.selectedTaskListIdToDelete = null;
        },
        error: err => {
          console.error('Failed to delete task list:', err);
          alert('Error deleting task list');
        }
      });
    }
  }

}
