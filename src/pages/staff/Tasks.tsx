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
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

type Tab = 'repair' | 'reading' | 'disconnection';

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('repair');

  // Filter tugas khusus untuk staff yang sedang login
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

  // FUNGSI 1: Memulai Pekerjaan
  const handleStartTask = async (task: any) => {
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        status: 'in-progress' // Mengubah status menjadi sedang dikerjakan
      });
      alert('Pekerjaan dimulai! Silakan kerjakan tugas sesuai SOP.');
    } catch (error) {
      console.error(error);
      alert('Gagal memulai pekerjaan');
    }
  };

  // FUNGSI 2: Menyelesaikan Pekerjaan
  const handleCompleteTask = async (task: any) => {
    const confirmComplete = window.confirm('Apakah Anda yakin sudah menyelesaikan pekerjaan ini sepenuhnya?');
    if (confirmComplete) {
      try {
        // Update status perintah kerja jadi selesai
        const taskRef = doc(db, 'tasks', task.id);
        await updateDoc(taskRef, {
          status: 'completed',
          completedAt: new Date().toISOString()
        });
        
        // Update status pengaduan jadi selesai (jika tugas ini berasal dari pengaduan)
        if (task.pengaduanId) {
          const pengaduanRef = doc(db, 'pengaduan', task.pengaduanId);
          await updateDoc(pengaduanRef, {
            status: 'Selesai'
          });
        }
        
        alert('Kerja bagus! Tugas berhasil diselesaikan.');
      } catch (error) {
        console.error(error);
        alert('Gagal menyelesaikan tugas');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-surface pb-12">
      <header className="flex justify-between items-center px-6 h-16 sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/staff')}
            className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 cursor-pointer hover:ring-2 hover:ring-#00478d/20 transition-all shadow-sm"
          >
            <img src={user?.avatar || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop"} alt="Staff" className="w-full h-full object-cover" />
          </button>
          <span className="text-lg font-headline font-bold text-[#00478d] tracking-tight">{t('app.name')}</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <button className="p-2 text-[#00478d] hover:bg-[#00478d]/5 rounded-full relative">
            <Bell size={20} />
            {myTasks.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />}
          </button>
          <button onClick={logout} className="p-2 text-error hover:bg-error/5 rounded-full"><LogOut size={20} /></button>
        </div>
      </header>

      <main className="px-6 py-6 space-y-8">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#00478d] to-[#005eb8] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#00478d]/20 relative overflow-hidden"
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

        <section className="grid grid-cols-3 gap-3">
          <div onClick={() => setActiveTab('reading')} className={`p-4 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer ${activeTab === 'reading' ? 'bg-[#00478d]/10 ring-1 ring-#00478d/20' : 'bg-slate-100 hover:bg-slate-200'}`}>
            <Droplets size={20} className="text-[#00478d] mb-2" />
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

        <nav className="flex p-1.5 bg-slate-200/50 rounded-full">
          {(['repair', 'reading', 'disconnection'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-2 rounded-full font-bold text-[10px] uppercase tracking-tighter transition-all ${
                activeTab === tab ? 'bg-white shadow-sm text-[#00478d]' : 'text-slate-500 hover:bg-white/50'
              }`}
            >
              {tab === 'disconnection' ? t('staff.tabs.disconnection') : t(`staff.tabs.${tab}`)}
            </button>
          ))}
        </nav>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-headline font-bold">
              Antrean {activeTab === 'repair' ? 'Perbaikan' : activeTab === 'reading' ? 'Pencatatan' : 'Pemutusan'}
            </h3>
            <span className="text-xs font-bold text-slate-400">{activeTasks.length} {t('staff.tasks.work_orders')}</span>
          </div>

          <AnimatePresence mode="wait">
            <div className="space-y-4">
              {activeTab === 'reading' && (
                <button 
                  onClick={() => navigate('/staff/meter-reading')}
                  className="w-full bg-[#00478d] text-white py-5 rounded-[2rem] font-bold text-sm shadow-lg shadow-#00478d/20 flex items-center justify-center gap-3 active:scale-95 transition-all mb-4"
                >
                  <Gauge size={20} />
                  {t('staff.tasks.manual_reading')}
                </button>
              )}

              {activeTasks.length === 0 ? (
                <div className="py-8 text-center text-slate-400 italic text-sm">
                   Belum ada tugas di kategori ini
                </div>
              ) : (
                activeTasks.map((task, i) => (
                  <motion.article 
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-white p-6 rounded-[2.5rem] shadow-sm border space-y-4 ${task.status === 'completed' ? 'border-emerald-100 opacity-70' : task.status === 'in-progress' ? 'border-[#00478d] ring-2 ring-#00478d/20' : 'border-slate-50'}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                        task.status === 'in-progress' ? 'bg-[#00478d]/10 text-[#00478d]' :
                        task.priority === 'high' ? 'bg-error/10 text-error' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {task.status === 'completed' ? 'SELESAI' : 
                         task.status === 'in-progress' ? 'DIPROSES STAFF' : 
                         task.priority === 'high' ? 'PRIORITAS TINGGI' : 'NORMAL'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">Nomor ID: {task.id}</span>
                    </div>

                    <div>
                      <h4 className="text-lg font-headline font-bold">
                        {task.type === 'reading' && t('admin.tasks.type.reading')}
                        {task.type === 'disconnection' && `${t('admin.tasks.type.disconnection_prefix')} ${task.customerName}`}
                        {task.type === 'repair' && `Perbaikan: ${task.reason?.split('-')[0] || 'Laporan Masuk'}`}
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
                        <Calendar size={16} className="text-[#00478d]" />
                        <span className="text-xs font-bold">Siklus Terjadwal</span>
                      </div>
                      {task.deadline && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-[#00478d]" />
                          <span className="text-[10px] font-bold uppercase leading-tight">
                            SELESAIKAN SEBELUM DEADLINE<br/>
                            {task.deadline === 'URGENT' ? '24 JAM' : task.deadline === 'CYCLE' ? 'AKHIR BULAN' : task.deadline}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* AREA TOMBOL AKSI */}
                    {task.status !== 'completed' && (
                      <div className="flex gap-3">
                        {task.status === 'in-progress' ? (
                           <button 
                             onClick={() => handleCompleteTask(task)}
                             className="flex-1 bg-emerald-500 text-white py-4 rounded-full font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                           >
                             <CheckCircle2 size={20} />
                             Selesaikan Pekerjaan
                           </button>
                        ) : (
                           <button 
                             onClick={() => {
                                if (task.type === 'reading') navigate(`/staff/meter-reading?taskId=${task.id}`);
                                else if (task.type === 'disconnection') navigate(`/staff/disconnection/${task.id}`);
                                else handleStartTask(task);
                             }}
                             className={`flex-1 text-white py-4 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all ${
                                task.type === 'disconnection' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-[#00478d] shadow-#00478d/20'
                             }`}
                           >
                             Mulai Pekerjaan {task.type === 'disconnection' ? 'Pemutusan' : task.type === 'repair' ? 'Perbaikan' : 'Pencatatan'}
                           </button>
                        )}
                        
                        {/* Tombol Tiga Titik hanya muncul jika belum dikerjakan */}
                        {task.status !== 'in-progress' && (
                          <button className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 active:scale-95 transition-all">
                            <MoreHorizontal size={24} />
                          </button>
                        )}
                      </div>
                    )}
                  </motion.article>
                ))
              )}
            </div>
          </AnimatePresence>
        </section>

        <section className="bg-white p-6 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:bg-[#00478d]/5 transition-colors border border-slate-50">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#00478d]/5 rounded-2xl flex items-center justify-center text-[#00478d] group-hover:bg-[#00478d] group-hover:text-white transition-all">
                <ClipboardList size={24} />
             </div>
             <div>
               <h5 className="font-headline font-bold text-sm">{t('staff.tasks.sop.title')}</h5>
               <p className="text-[10px] text-slate-500 font-bold">{t('staff.tasks.sop.subtitle')}</p>
             </div>
          </div>
          <ArrowRight size={20} className="text-[#00478d] group-hover:translate-x-1 transition-transform" />
        </section>
      </main>
    </div>
  );
}
