export interface Leave {
  id: number;                    // maps to Long id
  subject: string;
  description: string;
  leavedate: string;             // Date from backend, serialized as ISO string
  daytype: string;
  statusofleave: string;
  requestdate: string;           // Date string ISO
  updateDate?: string | null;    // optional, ISO string
  reasonfordeclineleave?: string | null;
  user: {
    id: number;
    username?: string;
  };
  // Optional fields for frontend convenience
  halfType?: 'First Half' | 'Second Half';
}
