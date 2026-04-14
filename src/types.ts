export type UserRole = 'admin' | 'staff' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  location: string;
  district: string;
  priority: 'high' | 'normal';
  status: 'pending' | 'in-progress' | 'completed';
  type: 'repair' | 'reading';
  deadline?: string;
}

export interface Bill {
  id: string;
  month: string;
  year: string;
  amount: number;
  usage: number;
  paidDate: string;
  status: 'paid' | 'unpaid';
}
