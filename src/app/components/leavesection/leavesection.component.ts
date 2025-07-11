import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from '../../services/auth-service.service';
import { Leave } from './leave.model';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-leave-section',
  templateUrl: './leavesection.component.html',
})
export class LeaveSectionComponent implements OnInit {
  leaves: Leave[] = [];
  showFormModal = false;
  deleteTarget: Leave | null = null;
  currentEdit: Leave | null = null;
  declineTarget: Leave | null = null;

  declineReason = '';

  formData = {
    subject: '',
    description: '',
    leaveDate: '',
    dayType: 'Full Day' as 'Full Day' | 'Half Day',
    halfType: 'First Half' as 'First Half' | 'Second Half',
  };

  userId: number | null = null;

  constructor(
    private toastr: ToastrService,
    public authService: AuthServiceService,
    private leaveService: LeaveService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.leaveService.getAllLeaves().subscribe((leaves) => {
      this.leaves = leaves.map((l) => ({
        ...l,
        leaveDate: l.leavedate,
        dayType: l.daytype,
        status: l.statusofleave,
        description: l.description || l.reasonfordeclineleave || '',
        userId: l.user?.id,
        userName: l.user?.username || 'Unknown',
        declineReason: l.reasonfordeclineleave || '',
        halfType: l.halfType,
      }));

      if (!this.authService.isAdmin() && this.userId !== null) {
        this.leaves = this.leaves.filter((l) => l.user.id === this.userId);
      }
    });
  }

  openFormModal(): void {
    this.resetForm();
    this.showFormModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeFormModal(): void {
    this.showFormModal = false;
    document.body.style.overflow = 'auto';
  }

  editLeave(leave: Leave): void {
    this.currentEdit = { ...leave };
    this.formData = {
      subject: leave.subject,
      description: leave.description,
      leaveDate: new Date(leave.leavedate).toISOString().substring(0, 10),
      dayType: leave.daytype === 'Half Day' ? 'Half Day' : 'Full Day',
      halfType: leave.halfType || 'First Half',
    };
    this.openFormModal();
  }

  deleteLeave(id: number): void {
    this.deleteTarget = this.leaves.find((l) => l.id === id) || null;
  }

  cancelDelete(): void {
    this.deleteTarget = null;
  }

  confirmDelete(): void {
    if (this.deleteTarget) {
      this.leaveService.deleteLeaveById(this.deleteTarget.id).subscribe(() => {
        this.toastr.info('Leave deleted');
        this.loadLeaves();
        this.deleteTarget = null;
      });
    }
  }

  onSubmit(): void {
    if (this.currentEdit) {
      this.updateLeave();
    } else {
      this.addLeave();
    }
  }

  addLeave(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.toastr.error('User ID not found. Please log in again.');
      return;
    }

    const payload = {
      subject: this.formData.subject,
      description: this.formData.description,
      leavedate: this.formData.leaveDate,
      daytype: this.formData.dayType,
      statusofleave: 'Pending',
      reasonfordeclineleave: '',
      user: { id: userId },
    };

    this.leaveService.createLeave(payload).subscribe({
      next: () => {
        this.toastr.success('Leave submitted successfully');
        this.loadLeaves();
        this.resetForm();
        this.closeFormModal();
      },
      error: () => {
        this.toastr.error('Failed to submit leave');
      },
    });
  }

  updateLeave(): void {
    if (!this.currentEdit) return;

    const updated: Leave = {
      ...this.currentEdit,
      subject: this.formData.subject,
      description: this.formData.description,
      leavedate: this.formData.leaveDate,
      daytype: this.formData.dayType,
      halfType: this.formData.dayType === 'Half Day' ? this.formData.halfType : undefined,
      updateDate: new Date().toISOString(),
    };

    this.leaveService.updateLeaveById(updated.id, updated).subscribe(() => {
      this.toastr.success('Leave updated');
      this.loadLeaves();
      this.currentEdit = null;
      this.closeFormModal();
    });
  }

  acceptLeave(leave: Leave): void {
    leave.statusofleave = 'Accepted';
    leave.updateDate = new Date().toISOString();
    this.leaveService.updateLeaveById(leave.id, leave).subscribe(() => {
      this.toastr.success('Leave accepted');
      this.loadLeaves();
    });
  }

  declineLeave(leave: Leave): void {
    this.declineTarget = leave;
    this.declineReason = '';
  }

  confirmDecline(reason: string): void {
    if (this.declineTarget) {
      const l = this.declineTarget;
      l.statusofleave = 'Declined';
      l.reasonfordeclineleave = reason;
      l.updateDate = new Date().toISOString();
      this.leaveService.updateLeaveById(l.id, l).subscribe(() => {
        this.toastr.warning('Leave declined');
        this.declineTarget = null;
        this.loadLeaves();
      });
    }
  }

  cancelDecline(): void {
    this.declineTarget = null;
    this.declineReason = '';
  }

  resetForm(): void {
    this.formData = {
      subject: '',
      description: '',
      leaveDate: '',
      dayType: 'Full Day',
      halfType: 'First Half',
    };
    this.currentEdit = null;
  }
}
