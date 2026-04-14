import React from 'react';
import { motion } from 'motion/react';
import { Wrench, MapPin, User, Clock, CheckCircle2, AlertCircle, MoreHorizontal } from 'lucide-react';

export default function Repairs() {
  const repairs = [
    { id: 'REP-102', title: 'Main Pipe Leakage', location: 'Jl. Gajah Mada', staff: 'Siti Rahayu', status: 'in-progress', priority: 'high' },
    { id: 'REP-103', title: 'Meter Replacement', location: 'Kamboja Residence', staff: 'Dewi Nurani', status: 'pending', priority: 'normal' },
    { id: 'REP-104', title: 'Pressure Valve Fix', location: 'North Basin Zone B', staff: 'Unassigned', status: 'unassigned', priority: 'high' },
    { id: 'REP-101', title: 'Customer Connection', location: 'West Sector 4', staff: 'Budi Kusuma', status: 'completed', priority: 'normal' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-headline font-bold">Repair Management</h2>
          <p className="text-sm text-slate-500">Track and assign maintenance tasks across the network.</p>
        </div>
        <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20">
          New Repair Ticket
        </button>
      </header>

      {/* Status Overview */}
      <section className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active', count: 14, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Pending', count: 8, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Unassigned', count: 3, color: 'text-error', bg: 'bg-error/5' },
          { label: 'Completed', count: 42, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} p-6 rounded-[2rem] border border-slate-100`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${s.color}`}>{s.label}</p>
            <h4 className="text-2xl font-headline font-bold mt-1">{s.count}</h4>
          </div>
        ))}
      </section>

      {/* Repair List */}
      <section className="space-y-4">
        {repairs.map((rep, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                rep.priority === 'high' ? 'bg-error/10 text-error' : 'bg-slate-100 text-slate-400'
              }`}>
                <Wrench size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold">{rep.title}</h4>
                  <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    rep.priority === 'high' ? 'bg-error/10 text-error' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {rep.priority}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {rep.location}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {rep.staff}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                  rep.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                  rep.status === 'in-progress' ? 'bg-primary/10 text-primary' :
                  rep.status === 'unassigned' ? 'bg-error/10 text-error' : 'bg-amber-100 text-amber-600'
                }`}>
                  {rep.status.replace('-', ' ')}
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">{rep.id}</p>
              </div>
              <button className="p-2 text-slate-300 hover:text-primary transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
