import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from './types';

interface TaskContextType {
  tasks: Task[];
  createTask: (task: Omit<Task, 'id' | 'status' | 'completedAt'>) => void;
  assignTask: (taskId: string, staffId: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status'], report?: Task['report']) => void;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const INITIAL_TASKS: Task[] = [
  {
    id: 'TSK-001',
    title: '', // UI will generate this
    location: 'Jl. Merdeka No. 10',
    district: 'Seruyan Hilir',
    priority: 'high',
    status: 'pending',
    type: 'disconnection',
    customerName: 'Budi Santoso',
    reason: 'Arrears > 3 Months',
    deadline: 'URGENT'
  },
  {
    id: 'TSK-002',
    title: '', // UI will generate this
    location: 'Jl. Sudirman No. 5',
    district: 'Seruyan Hulu',
    priority: 'normal',
    status: 'assigned',
    type: 'repair',
    assignedTo: 'staff-1',
    reason: 'Leakage at Jl. Sudirman',
    deadline: 'CYCLE'
  }
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset data for the new localization structure
    const dbVersion = localStorage.getItem('seruyan_db_version_tasks');
    const resetNeeded = dbVersion !== '2.0';

    if (resetNeeded) {
      localStorage.removeItem('seruyan_db_tasks');
      localStorage.setItem('seruyan_db_version_tasks', '2.0');
    }

    const storedTasks = localStorage.getItem('seruyan_db_tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(INITIAL_TASKS);
      localStorage.setItem('seruyan_db_tasks', JSON.stringify(INITIAL_TASKS));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('seruyan_db_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const createTask = (taskData: Omit<Task, 'id' | 'status' | 'completedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending'
    };
    setTasks(prev => [...prev, newTask]);
  };

  const assignTask = (taskId: string, staffId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'assigned' as const, assignedTo: staffId } : t
    ));
  };

  const updateTaskStatus = (taskId: string, status: Task['status'], report?: Task['report']) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { 
        ...t, 
        status, 
        report: report || t.report,
        completedAt: status === 'completed' ? new Date().toISOString() : t.completedAt
      } : t
    ));
  };

  return (
    <TaskContext.Provider value={{ tasks, createTask, assignTask, updateTaskStatus, isLoading }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
