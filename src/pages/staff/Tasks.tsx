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
  ClipboardList, 
  LogOut,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import { useTasks } from '../../taskContext';
import { useLanguage } from '../../languageContext';
import LanguageToggle from '../../components/LanguageToggle';
import { db } from '../../firebase';

type Tab = 'repair' | 'reading' | 'disconnection';

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('repair');

  // Filter tasks assigned to this specific staff member
  const myTasks = tasks.filter(t => t.assignedTo === user?.id);
  
  const activeTasks = myTasks.filter(t => {
     if (activeTab === 'repair') return t.type === 'repair';
     if (activeTab === 'reading') return t.type === 'reading';
     return t.type === 'disconnection';
  });

  const stats = {
    readings: myTasks.filter(t => t.type === 'reading' && t.status !== 'completed').length,
    repairs: myTasks.filter(t => t.type === 'repair' && t.status !== 'completed').length,
    disconnections: myTasks.filter(t => t.type === 'disconnection' && t.status !== 'completed').length
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-surface pb-12">
      {/* Header */}
      <header className="flex justify-between items-center px-6 h-16 sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/staff')}
            className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all shadow-sm"
          >
            <img src={user?.avatar} alt="Staff" className="w-full h-full object-cover" />
          </button>
          <span className="text-lg font-headline font-bold text-primary tracking-tight">{t('app.name')}</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <button className="p-2 text-primary hover:bg-primary/5 rounded-full relative">
            <Bell size={20} />
            {myTasks.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />}
          </button>
          <button onClick={logout} className="p-2 text-error hover:bg-error/5 rounded-full"><LogOut size={20} /></button>
        </div>
      </header>

      <main className="px-6 py-6 space-y-8">
        {/* Daily Quota Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-primary-container rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-2">{t('staff.stats.daily_target')}</p>
          <h2 className="text-3xl font-headline font-bold mb-1">{myTasks.filter(t => t.status !== 'completed').length} {t('admin.stats.task_orders')}</h2>
          <p className="text-sm opacity-90">{user?.name} • {t('staff.profile.sector')}</p>
          
          <div className="mt-8 flex items-end gap-2">
            <span className="text-5xl font-headline font-extrabold">{myTasks.length > 0 ? Math.round((myTasks.filter(t => t.status === 'completed').length / myTasks.length) * 100) : 0}%</span>
            <span className="text-xs mb-2 opacity-80 font-bold">{t('staff.stats.completed')} {t('staff.stats.today')}</span>
          </div>
        </motion.section>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-3 gap-3">
          <div onClick={() => setActiveTab('reading')} className={`p-4 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer ${activeTab === 'reading' ? 'bg-primary/10 ring-1 ring-primary/20' : 'bg-slate-100 hover:bg-slate-200'}`}>
            <Droplets size={20} className="text-primary mb-2" />
            <span className="text-[9px] font-bold text-slate-500 uppercase">{t('staff.tabs.reading')}</span>
            <span className="text-xl font-headline font-bold text-on-surface">{stats.readings}</span>
          </div>
          <div onClick={() => setActiveTab('repair')} className={`p-4 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer ${activeTab === 'repair' ? 'bg-red-50 ring-1 ring-red-200' : 'bg-slate-100 hover:bg-slate-200'}`}>
            <Wrench size={20} className="text-red-500 mb-2" />
            <span className="text-[9px] font-bold text-slate-500 uppercase">{t('staff.tabs.repair')}</span>
            <span className="text-xl font-headline font-bold text-red-600">{stats.repairs}</span>
          </div>
          <div onClick={() => setActiveTab('disconnection')} className={`p-4 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer ${activeTab === 'disconnection' ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-slate-100 hover:bg-slate-200'}`}>
            <Scissors size={20} className="text-amber-500 mb-2" />
            <span className="text-[9px] font-bold text-slate-500 uppercase">{t('staff.tabs.disconnection')}</span>
            <span className="text-xl font-headline font-bold text-amber-600">{stats.disconnections}</span>
          </div>
        </section>

        {/* Task Tabs */}
        <nav className="flex p-1.5 bg-slate-200/50 rounded-full">
          {(['repair', 'reading', 'disconnection'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-2 rounded-full font-bold text-[10px] uppercase tracking-tighter transition-all ${
                activeTab === tab ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:bg-white/50'
              }`}
            >
              {tab === 'disconnection' ? t('staff.tabs.disconnection') : t(`staff.tabs.${tab}`)}
            </button>
          ))}
        </nav>

        {/* Task List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-headline font-bold">
              {activeTab === 'repair' ? t('staff.tasks.queue.repair') : activeTab === 'reading' ? t('staff.tasks.queue.reading') : t('staff.tasks.queue.disconnection')}
            </h3>
            <span className="text-xs font-bold text-slate-400">{activeTasks.length} {t('staff.tasks.work_orders')}</span>
          </div>

          <AnimatePresence mode="wait">
            <div className="space-y-4">
              {activeTab === 'reading' && (
                <button 
                  onClick={() => navigate('/staff/meter-reading')}
                  className="w-full bg-primary text-white py-5 rounded-[2rem] font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all mb-4"
                >
                  <Gauge size={20} />
                  {t('staff.tasks.manual_reading')}
                </button>
              )}

              {activeTasks.length === 0 ? (
                <div className="py-8 text-center text-slate-400 italic text-sm">
                   {activeTab === 'reading' ? t('staff.tasks.empty.reading') : t('staff.tasks.empty.generic')}
                </div>
              ) : (
                activeTasks.map((task, i) => (
                  <motion.article 
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        task.priority === 'high' ? 'bg-error/10 text-error' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {t(`admin.tasks.priority.${task.priority}`).toUpperCase()}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{t('staff.tasks.id')}: {task.id}</span>
                    </div>

                    <div>
                      <h4 className="text-lg font-headline font-bold">
                        {task.type === 'reading' && t('admin.tasks.type.reading')}
                        {task.type === 'disconnection' && `${t('admin.tasks.type.disconnection_prefix')} ${task.customerName}`}
                        {task.type === 'repair' && `${t('admin.tasks.type.repair_prefix')} ${task.reason}`}
                      </h4>
                      <p className="text-sm text-slate-500">{task.district} • {task.location}</p>
                      {task.reason && (
                         <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 font-bold bg-amber-50 w-fit px-2 py-1 rounded-lg">
                            <AlertTriangle size={12} /> {task.reason}
                         </div>
                      )}
                    </div>

                    <div className="flex items-center gap-6 py-4 border-y border-slate-50">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <span className="text-xs font-bold">{t('staff.tasks.cycle.planned')}</span>
                      </div>
                      {task.deadline && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-primary" />
                          <span className="text-xs font-bold uppercase">
                            {t('staff.tasks.deadline.by').toUpperCase()} {' '}
                            {task.deadline === 'URGENT' ? t('admin.tasks.deadline.urgent') : 
                             task.deadline === 'CYCLE' ? t('admin.tasks.deadline.cycle') : task.deadline}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                           if (task.type === 'reading') navigate(`/staff/meter-reading?taskId=${task.id}`);
                           if (task.type === 'disconnection') navigate(`/staff/disconnection/${task.id}`);
                        }}
                        className={`flex-1 text-white py-4 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all ${
                           task.type === 'disconnection' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-primary shadow-primary/20'
                        }`}
                      >
                        {t('staff.tasks.button.start')} {task.type === 'disconnection' ? t('staff.tabs.disconnection') : task.type === 'repair' ? t('staff.tabs.repair') : t('staff.tabs.reading')}
                      </button>
                      <button className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 active:scale-95 transition-all">
                        <MoreHorizontal size={24} />
                      </button>
                    </div>
                  </motion.article>
                ))
              )}
            </div>
          </AnimatePresence>
        </section>

        {/* Protocol Card */}
        <section className="bg-white p-6 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:bg-primary/5 transition-colors border border-slate-50">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <ClipboardList size={24} />
             </div>
             <div>
               <h5 className="font-headline font-bold text-sm">{t('staff.tasks.sop.title')}</h5>
               <p className="text-[10px] text-slate-500 font-bold">{t('staff.tasks.sop.subtitle')}</p>
             </div>
          </div>
          <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
        </section>
      </main>
    </div>
  );
}
