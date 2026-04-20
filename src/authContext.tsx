import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  confirmPasswordReset,
  User as FirebaseUser,
  getAuth,
  setPersistence,
  inMemoryPersistence
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot, 
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import { auth, db, firebaseConfig } from './firebase';
import { User, UserRole } from './types';

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  login: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, address: string, password: string, role: UserRole) => Promise<{ success: boolean; status: 'active' | 'pending' }>;
  verifyCode: (emailOrPhone: string, code: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'pending' | 'blocked') => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message?: string }>;
  confirmNewPassword: (code: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync current user profile from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional profile data from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser({ ...userData, id: firebaseUser.uid });
        } else {
          // If doc doesn't exist, we don't set user to null immediately 
          // to allow loginWithGoogle or register to complete their setDoc calls.
          // Instead, we just wait. If after some time it still doesn't exist, then it's null.
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync all users for Admin
  useEffect(() => {
    if (user?.role === 'admin') {
      const q = collection(db, 'users');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const usersList: User[] = [];
        snapshot.forEach((doc) => {
          usersList.push({ ...(doc.data() as User), id: doc.id });
        });
        setAllUsers(usersList);
      });
      return () => unsubscribe();
    } else {
      setAllUsers([]);
    }
  }, [user]);

  const login = async (emailOrPhone: string, password?: string) => {
    try {
      if (!password) {
        return { success: false, message: 'Password is required' };
      }

      let loginId = emailOrPhone;
      // Convert username to email format
      if (!loginId.includes('@') && isNaN(Number(loginId))) {
        loginId = `${loginId}@pdamseruyan.com`;
      }
      const userCredential = await signInWithEmailAndPassword(auth, loginId, password);
      const firebaseUser = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        await signOut(auth);
        return { success: false, message: 'Account details not found in database' };
      }

      const userData = userDoc.data() as User;
      
      if (userData.status === 'pending') {
        await signOut(auth);
        return { success: false, message: 'PENDING_VERIFICATION' };
      }

      if (userData.status === 'blocked') {
        await signOut(auth);
        return { success: false, message: 'Account blocked' };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'Invalid email or password';
      if (error.code === 'auth/user-not-found') message = 'Account not found';
      if (error.code === 'auth/wrong-password') message = 'Invalid password';
      return { success: false, message };
    }
  };



  const register = async (name: string, email: string, phone: string, address: string, password: string, role: UserRole) => {
    try {
      let authEmail = email;
      if (!authEmail.includes('@') && isNaN(Number(authEmail))) {
        authEmail = `${authEmail}@pdamseruyan.com`;
      }

      const secondaryApp = initializeApp(firebaseConfig, `SecondaryApp-${Date.now()}`);
      const secondaryAuth = getAuth(secondaryApp);
      await setPersistence(secondaryAuth, inMemoryPersistence);

      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, authEmail, password);
      const firebaseUser = userCredential.user;

      const status = 'active';

      const newUser: User = {
        id: firebaseUser.uid,
        name,
        email,
        phone,
        address,
        role,
        status,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);

      // Sign out from the secondary instance just to clear its state
      await signOut(secondaryAuth);

      return { success: true, status: status as 'active' | 'pending' };
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already registered');
      }
      throw error;
    }
  };

  const verifyCode = async (emailOrPhone: string, code: string) => {
    return { success: false, message: 'Verification code feature has been removed' };
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'pending' | 'blocked') => {
    try {
      await updateDoc(doc(db, 'users', userId), { status });
    } catch (error) {
      console.error('Update user status error:', error);
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Reset password error:', error);
      let message = 'Failed to send reset email';
      if (error.code === 'auth/user-not-found') message = 'No account found with this email';
      if (error.code === 'auth/invalid-email') message = 'Invalid email address';
      return { success: false, message };
    }
  };

  const confirmNewPassword = async (code: string, newPassword: string) => {
    try {
      await confirmPasswordReset(auth, code, newPassword);
      return { success: true };
    } catch (error: any) {
      console.error('Confirm password error:', error);
      let message = 'Failed to update password';
      if (error.code === 'auth/expired-action-code') message = 'Reset link has expired';
      if (error.code === 'auth/invalid-action-code') message = 'Reset link is invalid or already used';
      if (error.code === 'auth/weak-password') message = 'Password is too weak';
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      allUsers, 
      login, 
      register, 
      verifyCode, 
      logout, 
      updateUserStatus, 
      sendPasswordReset,
      confirmNewPassword,
      isLoading 
    }}>
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
