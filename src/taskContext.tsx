import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from './types';
import { db } from './firebase'; // Pastikan path ini benar (biasanya './firebase' jika sejajar)
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';

interface TaskContextType {
  tasks: Task[];
  createTask: (task: Omit<Task, 'id' | 'status' | 'completedAt'>) => void;
  assignTask: (taskId: string, staffId: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status'], report?: Task['report']) => void;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Ambil data Perintah Kerja secara REAL-TIME dari Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(tasksData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Simpan Perintah Kerja baru ke Firebase (Dipanggil oleh Admin)
  const createTask = async (taskData: Omit<Task, 'id' | 'status' | 'completedAt'>) => {
    try {
      const newId = `TSK-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTask: Task = {
        ...taskData,
        id: newId,
        status: 'pending'
      };
      
      // Kirim data ke Firestore collection 'tasks'
      await setDoc(doc(db, 'tasks', newId), newTask);
    } catch (error) {
      console.error("Gagal membuat tugas di Firebase: ", error);
    }
  };

  // 3. Update staff yang ditugaskan ke Firebase
  const assignTask = async (taskId: string, staffId: string) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: 'assigned',
        assignedTo: staffId
      });
    } catch (error) {
      console.error("Gagal assign tugas: ", error);
    }
  };

  // 4. Update status (Selesai/Diproses) ke Firebase
  const updateTaskStatus = async (taskId: string, status: Task['status'], report?: Task['report']) => {
    try {
      const updateData: any = { status };
      if (report) updateData.report = report;
      if (status === 'completed') updateData.completedAt = new Date().toISOString();
      
      await updateDoc(doc(db, 'tasks', taskId), updateData);
    } catch (error) {
      console.error("Gagal update status tugas: ", error);
    }
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