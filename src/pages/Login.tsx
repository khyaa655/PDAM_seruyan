import React, { useState } from 'react';
import { useAuth } from '../authContext';
import { Navigate } from 'react-router-dom';
import { Waves, ShieldCheck, User as UserIcon, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const { user, login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'staff' | 'user'>('user');

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
            <Waves size={32} />
          </div>
          <h1 className="text-2xl font-headline font-bold text-primary">Seruyan Utility</h1>
          <p className="text-slate-500 text-sm">Sign in to manage your utility services</p>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Select Role to Demo</p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedRole('admin')}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                selectedRole === 'admin' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400 hover:border-slate-200'
              }`}
            >
              <ShieldCheck size={24} className="mb-2" />
              <span className="text-xs font-bold">Admin</span>
            </button>
            <button
              onClick={() => setSelectedRole('staff')}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                selectedRole === 'staff' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400 hover:border-slate-200'
              }`}
            >
              <Briefcase size={24} className="mb-2" />
              <span className="text-xs font-bold">Staff</span>
            </button>
            <button
              onClick={() => setSelectedRole('user')}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                selectedRole === 'user' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400 hover:border-slate-200'
              }`}
            >
              <UserIcon size={24} className="mb-2" />
              <span className="text-xs font-bold">User</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => login(selectedRole)}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
        >
          Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
        </button>
      </motion.div>
    </div>
  );
}
