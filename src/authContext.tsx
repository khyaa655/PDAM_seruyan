import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from './types';

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  login: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, password: string, role: UserRole) => Promise<{ success: boolean; status: 'active' | 'pending' }>;
  verifyCode: (emailOrPhone: string, code: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUserStatus: (userId: string, status: 'active' | 'pending' | 'blocked') => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Alex Seruyan',
    email: 'admin@seruyan.id',
    phone: '08111111111',
    password: 'password',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  },
  {
    id: 'staff-1',
    name: 'Budi Staff',
    email: 'staff@seruyan.id',
    phone: '08222222222',
    password: 'password',
    role: 'staff',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
  },
  {
    id: 'user-1',
    name: 'Ahmad Customer',
    email: 'user@seruyan.id',
    phone: '08333333333',
    password: 'password',
    role: 'user',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUsers = localStorage.getItem('seruyan_db_users');
    if (storedUsers) {
      setAllUsers(JSON.parse(storedUsers));
    } else {
      setAllUsers(INITIAL_USERS);
      localStorage.setItem('seruyan_db_users', JSON.stringify(INITIAL_USERS));
    }

    const savedUser = localStorage.getItem('seruyan_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (allUsers.length > 0) {
      localStorage.setItem('seruyan_db_users', JSON.stringify(allUsers));
    }
  }, [allUsers]);

  const login = async (emailOrPhone: string, password?: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find user by email or phone
    const foundUser = allUsers.find(u => 
      u.email === emailOrPhone || u.phone === emailOrPhone
    );
    
    if (!foundUser) {
      return { success: false, message: 'Account not found with this email or phone' };
    }

    if (password && foundUser.password !== password) {
      return { success: false, message: 'Invalid password' };
    }

    if (foundUser.status === 'pending') {
      return { success: false, message: 'PENDING_VERIFICATION' };
    }

    if (foundUser.status === 'blocked') {
      return { success: false, message: 'Account blocked' };
    }

    setUser(foundUser);
    localStorage.setItem('seruyan_user', JSON.stringify(foundUser));
    return { success: true };
  };

  const register = async (name: string, email: string, phone: string, password: string, role: UserRole) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check uniqueness
    if (allUsers.some(u => u.email === email)) throw new Error('Email already registered');
    if (allUsers.some(u => u.phone === phone)) throw new Error('Phone number already registered');

    const isStaff = role === 'staff';
    const status = isStaff ? 'pending' : 'active';
    
    // Generate 6-digit code for staff
    const verificationCode = isStaff 
      ? Math.floor(100000 + Math.random() * 900000).toString() 
      : undefined;

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      password,
      role,
      status,
      verificationCode,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };

    setAllUsers(prev => [...prev, newUser]);
    
    if (status === 'active') {
      setUser(newUser);
      localStorage.setItem('seruyan_user', JSON.stringify(newUser));
    }

    return { success: true, status };
  };

  const verifyCode = async (emailOrPhone: string, code: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedUsers = [...allUsers];
    const userIndex = updatedUsers.findIndex(u => 
      (u.email === emailOrPhone || u.phone === emailOrPhone) && u.verificationCode === code
    );

    if (userIndex === -1) {
      return { success: false, message: 'Invalid verification code' };
    }

    const updatedUser = { 
      ...updatedUsers[userIndex], 
      status: 'active' as const, 
      verificationCode: undefined 
    };
    
    updatedUsers[userIndex] = updatedUser;
    setAllUsers(updatedUsers);
    
    // Auto login
    setUser(updatedUser);
    localStorage.setItem('seruyan_user', JSON.stringify(updatedUser));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('seruyan_user');
  };

  const updateUserStatus = (userId: string, status: 'active' | 'pending' | 'blocked') => {
    setAllUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status } : u
    ));
    
    if (user?.id === userId) {
      const updatedUser = { ...user, status };
      setUser(updatedUser);
      localStorage.setItem('seruyan_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, allUsers, login, register, verifyCode, logout, updateUserStatus, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
