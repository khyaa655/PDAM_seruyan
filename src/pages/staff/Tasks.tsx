import React, { useState } from 'react';
import { 
  Waves, 
  Bell, 
  Droplets, 
  Wrench, 
  MapPin, 
  Calendar, 
  Clock, 
  MoreHorizontal, 
  ArrowRight, 
  Zap, 
  History, 
  ClipboardList, 
  Gauge, 
  LogOut 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'repair' | 'reading'>('repair');

  const repairTasks = [
    { 
      id: 'WM-90821', 
      title: 'Jl. Gajah Mada No. 42', 
      district: 'Seruyan Central • Commercial District', 
      priority: 'high', 
      type: 'repair',
      deadline: '14:00',
      image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ec3?w=400&h=300&fit=crop'
    },
    { 
      id: 'WM-90822', 
      title: 'Jl. Ahmad Yani No. 15', 
      district: 'Seruyan North • Residential', 
      priority: 'normal', 
      type: 'repair',
      deadline: '16:30'
    }
  ];

  const readingTasks = [
    { 
      id: 'R-7721', 
      title: 'Residence: Kamboja 12', 
      district: 'Residential Area', 
      priority: 'normal', 
      type: 'reading',
      status: 'pending',
      deadline: '17:00'
    },
    { 
      id: 'E-4410', 
      title: 'Seruyan High School', 
      district: 'Education Hub', 
      priority: 'high', 
      type: 'reading',
      status: 'pending',
      deadline: '12:00',
      image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=300&fit=crop'
    }
  ];

  const activeTasks = activeTab === 'repair' ? repairTasks : readingTasks;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-surface pb-12">
      {/* Header */}
      <header className="flex justify-between items-center px-6 h-16 sticky top-0 z-40 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button 
            onClick={logout}
            className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            title="Logout"
          >
            <img src={user?.avatar} alt="Staff" className="w-full h-full object-cover" />
          </button>
          <span className="text-lg font-headline font-bold text-primary tracking-tight">AquaFlow Utility</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-primary hover:bg-primary/5 rounded-full"><Bell size={20} /></button>
          <button onClick={logout} className="p-2 text-error hover:bg-error/5 rounded-full"><LogOut size={20} /></button>
        </div>
      </header>

      <main className="px-6 py-6 space-y-8">
        {/* Daily Quota Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-primary-container rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20"
        >
          <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-2">Daily Quota</p>
          <h2 className="text-3xl font-headline font-bold mb-1">12 Tasks Active</h2>
          <p className="text-sm opacity-90">Seruyan Sector B-12 • June 14, 2024</p>
          
          <div className="mt-8 flex items-end gap-2">
            <span className="text-5xl font-headline font-extrabold">84%</span>
            <span className="text-xs mb-2 opacity-80 font-bold">Completion Rate</span>
          </div>
        </motion.section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-slate-100 p-6 rounded-[2.5rem] flex flex-col justify-center">
            <Droplets size={24} className="text-tertiary mb-3 fill-tertiary/20" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Readings</span>
            <span className="text-2xl font-headline font-bold text-on-surface">08</span>
          </div>
          <div className="bg-slate-100 p-6 rounded-[2.5rem] flex flex-col justify-center border-l-4 border-error">
            <Wrench size={24} className="text-error mb-3 fill-error/20" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Repairs</span>
            <span className="text-2xl font-headline font-bold text-error">04</span>
          </div>
        </section>

        {/* Task Tabs */}
        <nav className="flex p-1.5 bg-slate-200/50 rounded-full">
          <button 
            onClick={() => setActiveTab('repair')}
            className={`flex-1 py-3 px-6 rounded-full font-bold text-sm transition-all ${
              activeTab === 'repair' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:bg-white/50'
            }`}
          >
            Repair Tasks
          </button>
          <button 
            onClick={() => setActiveTab('reading')}
            className={`flex-1 py-3 px-6 rounded-full font-bold text-sm transition-all ${
              activeTab === 'reading' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:bg-white/50'
            }`}
          >
            Meter Readings
          </button>
        </nav>

        {/* Task List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-headline font-bold">
              Queue: {activeTab === 'repair' ? 'Repair Tasks' : 'Meter Readings'}
            </h3>
            <button className="flex items-center gap-2 text-primary font-bold text-sm">
              <MapPin size={16} />
              View Map
            </button>
          </div>

          {activeTasks.map((task, i) => (
            <motion.article 
              key={`${activeTab}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 space-y-4"
            >
              {task.image && (
                <div className="w-full h-48 rounded-3xl overflow-hidden mb-4">
                  <img src={task.image} alt="Task" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  task.priority === 'high' ? 'bg-error/10 text-error' : 'bg-slate-100 text-slate-500'
                }`}>
                  {task.priority} Priority
                </span>
                <span className="text-[10px] font-bold text-slate-400">ID: {task.id}</span>
              </div>

              <div>
                <h4 className="text-lg font-headline font-bold">{task.title}</h4>
                <p className="text-sm text-slate-500">{task.district}</p>
              </div>

              <div className="flex items-center gap-6 py-4 border-y border-slate-50">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <span className="text-xs font-bold">
                    {activeTab === 'repair' ? 'Repair Cycle' : 'Monthly Cycle'}
                  </span>
                </div>
                {task.deadline && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    <span className="text-xs font-bold">BY {task.deadline}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => activeTab === 'reading' && navigate('/staff/meter-reading')}
                  className="flex-1 bg-primary text-white py-4 rounded-full font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  Start {activeTab === 'repair' ? 'Repair' : 'Reading'}
                </button>
                <button className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 active:scale-95 transition-all">
                  <MoreHorizontal size={24} />
                </button>
              </div>
            </motion.article>
          ))}
        </section>

        {/* Protocol Card */}
        <section className="bg-white p-6 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:bg-primary/5 transition-colors border border-slate-50">
          <div>
            <h5 className="font-headline font-bold text-sm">Review Protocols</h5>
            <p className="text-[10px] text-slate-500 font-bold">Update on {activeTab === 'repair' ? 'Safety Gear' : 'Meter V.4 Safety'}</p>
          </div>
          <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
        </section>
      </main>
    </div>
  );
}
