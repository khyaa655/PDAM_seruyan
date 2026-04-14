import React, { useState } from 'react';
import { useAuth } from '../authContext';
import { Navigate } from 'react-router-dom';
import { Waves, ShieldCheck, User as UserIcon, Briefcase, Mail, Lock, ArrowLeft, User as UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Step = 'role' | 'login' | 'register' | 'forgot-password';
type Role = 'admin' | 'staff' | 'user';

export default function Login() {
  const { user, login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>('user');
  const [step, setStep] = useState<Step>('role');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'staff') return <Navigate to="/staff" replace />;
    return <Navigate to="/user" replace />;
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'forgot-password') {
      alert(`Password reset link sent to ${email}`);
      setStep('login');
      return;
    }
    // Simulate register/login
    login(selectedRole);
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  const getRoleLabel = (role: Role) => role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 'role' ? (
            <motion.div 
              key="role"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50"
            >
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-primary to-primary-container rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
                  <Waves size={32} />
                </div>
                <h1 className="text-2xl font-headline font-bold text-slate-800">Seruyan Utility</h1>
                <p className="text-slate-500 text-sm mt-1">Select your portal access level</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => { setSelectedRole('admin'); setStep('login'); }}
                    className="group relative overflow-hidden flex items-center p-5 rounded-2xl border-2 border-slate-100 hover:border-primary/50 transition-all bg-white"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-slate-800">Admin Portal</span>
                      <span className="text-xs text-slate-500">System management & oversight</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => { setSelectedRole('staff'); setStep('login'); }}
                    className="group relative overflow-hidden flex items-center p-5 rounded-2xl border-2 border-slate-100 hover:border-primary/50 transition-all bg-white"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <Briefcase size={24} />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-slate-800">Staff Portal</span>
                      <span className="text-xs text-slate-500">Operations & meter reading</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => { setSelectedRole('user'); setStep('login'); }}
                    className="group relative overflow-hidden flex items-center p-5 rounded-2xl border-2 border-slate-100 hover:border-primary/50 transition-all bg-white"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <UserIcon size={24} />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-slate-800">Customer Portal</span>
                      <span className="text-xs text-slate-500">View usage & pay bills</span>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="auth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50"
            >
              <button 
                onClick={() => setStep('role')}
                className="mb-6 flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                Change Role
              </button>

              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
                  {getRoleLabel(selectedRole)} Access
                </span>
                <h2 className="text-2xl font-bold text-slate-800">
                  {step === 'login' ? 'Welcome back' : step === 'register' ? 'Create an account' : 'Reset password'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {step === 'login' ? 'Please enter your details to sign in.' : 
                   step === 'register' ? 'Sign up to get started securely.' : 
                   'Enter your email to receive a reset link.'}
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {step === 'register' && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 ml-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserCircle className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                {step !== 'forgot-password' && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 ml-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {step === 'login' && (
                  <div className="flex items-center justify-end">
                    <button 
                      type="button" 
                      onClick={() => setStep('forgot-password')}
                      className="text-sm font-medium text-primary hover:text-primary-container transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98] transition-all bg-gradient-to-r from-primary to-[#005cbb]"
                >
                  {step === 'login' ? 'Sign In' : step === 'register' ? 'Sign Up' : 'Send Reset Link'}
                </button>
              </form>

              {step !== 'forgot-password' && (
                <>
                  <div className="mt-6 flex items-center justify-center space-x-4">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-xs font-medium text-slate-400">OR CONTINUE WITH</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                  </div>

                  <button
                    onClick={() => login(selectedRole)}
                    type="button"
                    className="mt-6 w-full py-3.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center shadow-sm"
                  >
                    <GoogleIcon />
                    Google
                  </button>
                </>
              )}

              <div className="mt-6 text-center text-sm text-slate-500">
                {step === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button onClick={() => setStep('register')} className="font-bold text-primary hover:underline">
                      Sign up
                    </button>
                  </>
                ) : step === 'register' ? (
                  <>
                    Already have an account?{' '}
                    <button onClick={() => setStep('login')} className="font-bold text-primary hover:underline">
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Remember your password?{' '}
                    <button onClick={() => setStep('login')} className="font-bold text-primary hover:underline">
                      Back to login
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
