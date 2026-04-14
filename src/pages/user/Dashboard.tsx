import React, { useState } from 'react';
import { 
  Waves, 
  Bell, 
  Droplets, 
  Receipt, 
  History, 
  BarChart3, 
  Wrench, 
  ArrowRight, 
  Calendar, 
  Clock, 
  FileText,
  LogOut,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../authContext';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'billing' | 'usage'>('billing');

  const recentBills = [
    { 
      id: 'INV-2024-06', 
      month: 'June 2024', 
      amount: 'Rp 128.000', 
      usage: '12.5 m³', 
      status: 'paid',
      date: 'June 02, 2024',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop'
    },
    { 
      id: 'INV-2024-05', 
      month: 'May 2024', 
      amount: 'Rp 142.500', 
      usage: '14.1 m³', 
      status: 'paid',
      date: 'May 05, 2024'
    },
    { 
      id: 'INV-2024-04', 
      month: 'April 2024', 
      amount: 'Rp 115.200', 
      usage: '11.8 m³', 
      status: 'paid',
      date: 'April 04, 2024'
    }
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-surface pb-12">
      {/* Header - Matching Staff Style */}
      <header className="flex justify-between items-center px-6 h-16 sticky top-0 z-40 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button 
            onClick={logout}
            className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            title="Logout"
          >
            <img src={user?.avatar} alt="User" className="w-full h-full object-cover" />
          </button>
          <span className="text-lg font-headline font-bold text-primary tracking-tight">Seruyan Utility</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-primary hover:bg-primary/5 rounded-full"><Bell size={20} /></button>
          <button onClick={logout} className="p-2 text-error hover:bg-error/5 rounded-full"><LogOut size={20} /></button>
        </div>
      </header>

      <main className="px-6 py-6 space-y-8">
        {/* Summary Card - Matching Staff Gradient Style */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-primary-container rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20"
        >
          <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-2">Current Balance</p>
          <h2 className="text-3xl font-headline font-bold mb-1">Rp 342.500</h2>
          <p className="text-sm opacity-90">Due Date: July 05, 2024</p>
          
          <div className="mt-8 flex items-end gap-2">
            <button className="bg-white text-primary font-bold py-3 px-8 rounded-full text-sm shadow-lg active:scale-95 transition-all">
              Pay Now
            </button>
          </div>
        </motion.section>

        {/* Quick Stats - Matching Staff Grid Style */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-slate-100 p-6 rounded-[2.5rem] flex flex-col justify-center">
            <Droplets size={24} className="text-tertiary mb-3 fill-tertiary/20" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Usage (Jun)</span>
            <span className="text-2xl font-headline font-bold text-on-surface">12.5 m³</span>
          </div>
          <div className="bg-slate-100 p-6 rounded-[2.5rem] flex flex-col justify-center border-l-4 border-tertiary">
            <TrendingUp size={24} className="text-tertiary mb-3" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</span>
            <span className="text-2xl font-headline font-bold text-tertiary">Top 15%</span>
          </div>
        </section>

        {/* Action Tabs - Matching Staff Tab Style */}
        <nav className="flex p-1.5 bg-slate-200/50 rounded-full">
          <button 
            onClick={() => setActiveTab('billing')}
            className={`flex-1 py-3 px-6 rounded-full font-bold text-sm transition-all ${
              activeTab === 'billing' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:bg-white/50'
            }`}
          >
            Billing History
          </button>
          <button 
            onClick={() => setActiveTab('usage')}
            className={`flex-1 py-3 px-6 rounded-full font-bold text-sm transition-all ${
              activeTab === 'usage' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:bg-white/50'
            }`}
          >
            Usage Analysis
          </button>
        </nav>

        {/* Content Area */}
        {activeTab === 'billing' ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold">Recent Invoices</h3>
              <button className="flex items-center gap-2 text-primary font-bold text-sm">
                <History size={16} />
                View All
              </button>
            </div>

            {recentBills.map((bill, i) => (
              <motion.article 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 space-y-4"
              >
                {bill.image && (
                  <div className="w-full h-48 rounded-3xl overflow-hidden mb-4">
                    <img src={bill.image} alt="Invoice" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold uppercase">
                    {bill.status}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">ID: {bill.id}</span>
                </div>

                <div>
                  <h4 className="text-lg font-headline font-bold">{bill.month}</h4>
                  <p className="text-sm text-slate-500">Usage: {bill.usage}</p>
                </div>

                <div className="flex items-center gap-6 py-4 border-y border-slate-50">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    <span className="text-xs font-bold">{bill.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-xs font-bold">{bill.amount}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-slate-100 text-on-surface py-4 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors">
                    Download PDF
                  </button>
                  <button className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <FileText size={24} />
                  </button>
                </div>
              </motion.article>
            ))}
          </section>
        ) : (
          <section className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-6">Consumption Trend</h3>
              <div className="h-48 w-full flex items-end justify-between gap-2">
                {[40, 65, 55, 80, 92, 75].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      className={`w-full rounded-t-lg transition-colors ${i === 5 ? 'bg-primary' : 'bg-slate-100 group-hover:bg-primary/20'}`}
                    ></motion.div>
                    <span className={`text-[10px] mt-2 ${i === 5 ? 'text-primary font-bold' : 'text-slate-400'}`}>
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                <BarChart3 className="text-primary" size={24} />
                <div>
                  <p className="text-xs text-slate-500 font-bold">Total Consumption (YTD)</p>
                  <p className="text-lg font-bold text-primary">84.2 m³</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Support Card - Matching Staff Protocol Style */}
        <section className="bg-white p-6 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:bg-primary/5 transition-colors border border-slate-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-error/10 rounded-2xl text-error">
              <Wrench size={20} />
            </div>
            <div>
              <h5 className="font-headline font-bold text-sm">Report a Leak</h5>
              <p className="text-[10px] text-slate-500 font-bold">Emergency assistance available 24/7</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
        </section>
      </main>
    </div>
  );
}
