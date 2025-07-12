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
  declineReasonModalVisible = false;
  leaves: Leave[] = [];
  showFormModal = false;
  deleteTarget: Leave | null = null;
  currentEdit: Leave | null = null;
  declineTarget: any;
  declineReason: string = '';
  delineReasonAdmin: boolean = false;

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
        statusofleave: l.statusofleave,
        description: l.description || '',
        user: l.user,
        halfType: l.halfType,
        reasonfordeclineleave: l.reasonfordeclineleave,
      }));

      if (!this.authService.isAdmin() && this.userId !== null) {
        this.leaves = this.leaves.filter((l) => l.user?.id === this.userId);
      }
    });
  }

  openFormModal(): void {
    this.resetForm(); // Only reset if you're adding
    this.currentEdit = null;
    this.showFormModal = true;
    document.body.style.overflow = 'hidden';
  }


  closeFormModal(): void {
    this.showFormModal = false;
    document.body.style.overflow = 'auto';
  }

  editLeave(leave: Leave): void {
    this.currentEdit = { ...leave };

    // Convert date to yyyy-MM-dd format
    const formattedDate = leave.leavedate
      ? new Date(leave.leavedate).toISOString().split('T')[0]
      : '';

    this.formData = {
      subject: leave.subject || '',
      description: leave.description || '',
      leaveDate: formattedDate,
      dayType: leave.daytype as 'Full Day' | 'Half Day',
      halfType: leave.halfType || 'First Half',
    };

    this.showFormModal = true;
    document.body.style.overflow = 'hidden';
  }




  deleteLeave(id: number): void {
    // Show confirmation modal before deletion
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
      halfType: this.formData.dayType === 'Half Day' ? this.formData.halfType : undefined,
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
    if (leave.statusofleave === 'Pending') {
      const updatedLeave = {
        ...leave,
        statusofleave: 'Accepted',
        updateDate: new Date().toISOString(),
      };
      this.leaveService.updateLeaveById(leave.id, updatedLeave).subscribe(() => {
        this.toastr.success('Leave accepted');
        this.loadLeaves();
      });
    }
  }

  openDeclineReasonModal(leave: Leave) {
    this.declineReason = leave.reasonfordeclineleave || '';
    this.declineReasonModalVisible = true;
  }

  closeDeclineReasonModal() {
    this.declineReasonModalVisible = false;
  }

  showDeclineReasonAdminModal(leave: Leave): void {
    this.declineTarget = leave;
    this.delineReasonAdmin = true;
    this.declineReason = '';
  }

  closeDeclineReasonModal2() {
    this.delineReasonAdmin = false;
  }

  confirmDecline() {
    if (this.declineTarget && this.declineReason.trim()) {
      this.declineTarget.statusofleave = 'Declined';
      this.declineTarget.reasonfordeclineleave = this.declineReason;
      this.declineTarget.updateDate = new Date().toISOString();

      this.leaveService.updateLeaveById(this.declineTarget.id, this.declineTarget).subscribe(
        () => {
          this.toastr.success('Leave request declined successfully.');
          this.loadLeaves();
          this.closeDeclineReasonModal2();
        },
        (error) => {
          this.toastr.error('Failed to decline leave. Please try again.');
        }
      );
    } else {
      this.toastr.error('Please provide a reason for the decline.');
    }
  }

  cancelDecline() {
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

  // Helper method to disable buttons if status is Accepted or Declined
  isActionDisabled(leave: Leave): boolean {
    return leave.statusofleave === 'Accepted' || leave.statusofleave === 'Declined';
  }

}
