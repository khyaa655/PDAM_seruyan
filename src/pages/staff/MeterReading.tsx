import React from 'react';
import { 
  Waves, 
  Bell, 
  HelpCircle, 
  Search, 
  Gauge, 
  Camera, 
  Upload, 
  Home, 
  Wrench, 
  User as UserIcon,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';

export default function MeterReading() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-surface pb-24">
      {/* Top Nav */}
      <nav className="flex justify-between items-center px-8 h-16 w-full bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-100 rounded-full">
            <ChevronLeft size={24} className="text-primary" />
          </button>
          <span className="text-lg font-bold text-primary">Seruyan Utility</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Bell size={20} className="text-slate-500" />
            <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">3</span>
          </div>
          <HelpCircle size={20} className="text-slate-500" />
          <button 
            onClick={logout}
            className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            title="Logout"
          >
            <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
          </button>
        </div>
      </nav>

      <main className="px-6 py-6 space-y-8">
        <header>
          <h1 className="text-2xl font-headline font-bold tracking-tight text-on-surface mb-2">Reading Task</h1>
          <p className="text-slate-500 text-sm">Enter customer details or scan the meter unit to proceed.</p>
        </header>

        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customer ID or Name" 
            className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-slate-400 shadow-sm transition-all"
          />
        </div>

        {/* Customer Card */}
        <section className="bg-slate-100 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-1">Active Site</span>
              <h2 className="text-lg font-bold text-primary">#SW-2948-2024</h2>
            </div>
            <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold rounded-full">PRIORITY</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Customer Name</p>
              <p className="text-sm font-bold">Ahmad Sulaiman</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Meter Serial</p>
              <p className="text-sm font-bold">MTR-992-X1</p>
            </div>
          </div>
        </section>

        {/* Reading Inputs */}
        <section className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Gauge size={20} className="text-primary" />
              <h3 className="text-md font-bold">Meter Readings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Previous Reading (m³)</label>
                <div className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-500 font-mono text-lg">
                  004,291.50
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Current Reading Input</label>
                <input 
                  type="number" 
                  placeholder="000,000.00" 
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-xl text-primary font-mono text-2xl focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Visual Evidence */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50">
            <div className="flex items-center gap-3 mb-4">
              <Camera size={20} className="text-primary" />
              <h3 className="text-md font-bold">Visual Evidence</h3>
            </div>
            <div className="aspect-video w-full rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors group">
              <div className="text-center group-hover:scale-105 transition-transform">
                <Camera size={32} className="text-slate-300 mb-2 mx-auto" />
                <p className="text-xs text-slate-400 font-bold">Capture Meter Display</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-full py-5 rounded-[2rem] bg-gradient-to-br from-primary to-primary-container text-white font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <Upload size={20} />
            Submit Reading
          </button>
        </section>
      </main>
    </div>
  );
}
