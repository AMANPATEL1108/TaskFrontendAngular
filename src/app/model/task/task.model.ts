export interface Task {
  name: string;
  description: string;
  imageUrl?: string;
  assignedTo: string;
  endDate: Date;
  priority: 'Low' | 'Medium' | 'High';
}
