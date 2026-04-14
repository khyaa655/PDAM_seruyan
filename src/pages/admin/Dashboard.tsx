import React, { useState } from 'react';
import { 
  Waves, 
  Search, 
  Bell, 
  HelpCircle, 
  Plus, 
  Users, 
  BadgeCheck, 
  Clock, 
  TrendingUp, 
  History, 
  LayoutDashboard, 
  CreditCard, 
  Wrench, 
  Settings, 
  LogOut,
  Edit,
  Ban,
  Undo
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../authContext';
import WaterFlow from './WaterFlow';
import Billing from './Billing';
import Repairs from './Repairs';

type AdminView = 'dashboard' | 'waterflow' | 'billing' | 'repairs';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const stats = [
    { label: 'Total Users', value: '12,482', change: '+4.2%', color: 'text-primary', icon: Users, trend: 'up' },
    { label: 'Active Staff', value: '142', sub: '86% on-field', color: 'text-tertiary', icon: BadgeCheck },
    { label: 'Pending Registrations', value: '29', sub: 'Review required', color: 'text-secondary', icon: Clock },
  ];

  const employees = [
    { name: 'Budi Kusuma', email: 'budi.k@seruyanwater.id', role: 'Manager', region: 'Central District', status: 'Active', initials: 'BK' },
    { name: 'Siti Rahayu', email: 'siti.r@field.seruyan.id', role: 'Field Staff', region: 'North Basin', status: 'Active', initials: 'SR' },
    { name: 'Agus Jatmiko', email: 'agus@customer.com', role: 'Customer', region: 'West Sector', status: 'Inactive', initials: 'AJ' },
    { name: 'Dewi Nurani', email: 'dewi.n@field.seruyan.id', role: 'Field Staff', region: 'Central District', status: 'Active', initials: 'DN' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'waterflow': return <WaterFlow />;
      case 'billing': return <Billing />;
      case 'repairs': return <Repairs />;
      default: return (
        <div className="space-y-8">
          {/* Stats Grid */}
          <section className="grid grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <h3 className={`text-3xl font-headline font-extrabold mt-1 ${stat.color}`}>{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.color.replace('text-', 'bg-')}/5 ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
                {stat.change ? (
                  <p className="text-xs text-slate-500 mt-4 flex items-center gap-1">
                    <TrendingUp size={14} className="text-emerald-500" />
                    <span className="font-bold text-emerald-600">{stat.change}</span> from last month
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-4">{stat.sub}</p>
                )}
              </motion.div>
            ))}
          </section>

          {/* User Management Table */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 flex justify-between items-center border-b border-slate-50">
              <div>
                <h2 className="text-xl font-headline font-bold">User Management</h2>
                <p className="text-sm text-slate-500">Manage internal staff and customer accounts</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">
                <Plus size={18} />
                Add New User
              </button>
            </div>
            
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-4">User Name</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Region</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {employees.map((emp, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {emp.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        emp.role === 'Manager' ? 'bg-blue-100 text-blue-700' : 
                        emp.role === 'Field Staff' ? 'bg-slate-100 text-slate-600' : 'bg-tertiary/10 text-tertiary'
                      }`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-600">{emp.region}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        <span className={`text-xs font-bold ${emp.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {emp.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 text-slate-400">
                        <button className="p-2 hover:text-primary transition-colors"><Edit size={18} /></button>
                        {emp.status === 'Active' ? (
                          <button className="p-2 hover:text-error transition-colors"><Ban size={18} /></button>
                        ) : (
                          <button className="p-2 hover:text-primary transition-colors"><Undo size={18} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Activity Log */}
          <section className="bg-slate-900 rounded-3xl p-8 text-white border-l-8 border-primary">
            <div className="flex items-center gap-3 mb-6">
              <History className="text-primary" />
              <h2 className="font-bold text-lg">Activity Log (Recent Admin Tasks)</h2>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0"></div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <p className="text-sm font-bold">Tariff update pushed to South Basin</p>
                    <span className="text-[10px] font-bold text-slate-500">14 MINS AGO</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Admin Alex Seruyan adjusted base volumetric rates by +2% for industrial meters.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-slate-700 shrink-0"></div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <p className="text-sm font-bold">New Field Staff onboarded</p>
                    <span className="text-[10px] font-bold text-slate-500">2 HOURS AGO</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Siti Rahayu granted access to North Basin regional config and repair tickets.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-100 border-r border-slate-200 flex flex-col py-6 px-4 fixed h-full">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-headline font-bold text-primary tracking-tight">Seruyan Water</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Utility Management</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === 'dashboard' ? 'bg-white text-primary font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="text-sm">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveView('waterflow')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === 'waterflow' ? 'bg-white text-primary font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Waves size={20} />
            <span className="text-sm">Water Flow</span>
          </button>
          <button 
            onClick={() => setActiveView('billing')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === 'billing' ? 'bg-white text-primary font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CreditCard size={20} />
            <span className="text-sm">Billing</span>
          </button>
          <button 
            onClick={() => setActiveView('repairs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === 'repairs' ? 'bg-white text-primary font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Wrench size={20} />
            <span className="text-sm">Repairs</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-primary transition-colors">
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error/5 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Nav */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search users, regions..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
              Create Ticket
            </button>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><Bell size={20} /></button>
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><HelpCircle size={20} /></button>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="text-sm font-bold">{user?.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Utility Manager</p>
              </div>
              <button 
                onClick={logout}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10 cursor-pointer hover:border-primary transition-all"
                title="Logout"
              >
                <img src={user?.avatar} alt="Admin" className="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
