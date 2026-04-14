import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, TrendingUp, Download, Filter, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { useLanguage } from '../../languageContext';

export default function Billing() {
  const { t } = useLanguage();
  const transactions = [
    { id: 'TX-9921', user: 'Ahmad Sulaiman', amount: 'Rp 128.000', status: 'completed', date: '10:42 AM' },
    { id: 'TX-9920', user: 'Siti Aminah', amount: 'Rp 45.200', status: 'completed', date: '09:15 AM' },
    { id: 'TX-9919', user: 'Budi Santoso', amount: 'Rp 210.000', status: 'pending', date: '08:30 AM' },
    { id: 'TX-9918', user: 'Dewi Lestari', amount: 'Rp 88.500', status: 'completed', date: t('common.yesterday') },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-headline font-bold">{t('admin.billing.title')}</h2>
          <p className="text-sm text-slate-500">{t('admin.billing.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-sm font-bold text-slate-600">
            <Filter size={16} />
            {t('admin.billing.filter')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
            <Download size={16} />
            {t('user.billing.download')}
          </button>
        </div>
      </header>

      {/* Revenue Card */}
      <section className="bg-gradient-to-br from-tertiary to-tertiary-container rounded-[2.5rem] p-8 text-white shadow-xl shadow-tertiary/20">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-2">{t('admin.billing.monthly')}</p>
            <h3 className="text-4xl font-headline font-extrabold">Rp 1.24B</h3>
            <p className="text-sm mt-2 flex items-center gap-1">
              <TrendingUp size={16} />
              <span className="font-bold">+12.4%</span> {t('admin.stats.vs_last_month')}
            </p>
          </div>
          <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md">
            <CreditCard size={32} />
          </div>
        </div>
      </section>

      {/* Transaction List */}
      <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50">
          <h3 className="font-bold">{t('admin.billing.recent')}</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {transactions.map((tx, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${tx.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {tx.status === 'completed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold">{tx.user}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{tx.id} • {tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{tx.amount}</p>
                <button className="text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-widest">{t('common.details')}</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
