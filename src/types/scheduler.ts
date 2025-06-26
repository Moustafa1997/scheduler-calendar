export interface Worker {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'active' | 'maintenance';
  address: string;
}

export interface Shift {
  id: number;
  workerId: number | null;
  workerName: string;
  serviceClient: string;
  type: string;
  requiredRole: string;
  startTime: string;
  endTime: string;
  date: Date;
  status: 'covered' | 'uncovered';
  notes?: string;
}

export interface AssignmentData {
  worker: string;
  serviceClient: string;
  shiftType: string;
  requiredRole: string;
  startTime: string;
  endTime: string;
  date: Date;
  status: 'covered' | 'uncovered';
}

export interface DragState {
  item: Worker;
  time: string;
  timeIndex: number;
  x: number;
}

export interface DragPreview {
  item: Worker;
  startTime: string;
  endTime: string;
  width: number;
  left: number;
}