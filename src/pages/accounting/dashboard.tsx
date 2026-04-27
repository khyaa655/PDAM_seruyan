import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import {
  ArrowUpRight, ArrowDownLeft, TrendingUp, AlertCircle, 
  Loader2, Plus, MoreHorizontal, LogOut, Bell, Settings, Menu, X, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { formatCurrency } from '../../lib/utils';

type ModuleView = 'home' | 'ledger' | 'journals' | 'reports' | 'ap' | 'ar' | 'budget' | 'settings';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  status: 'pending' | 'verified' | 'posted';
}

export default function AccountingDashboard() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<ModuleView>('home');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // 1. Guard: Redirect jika bukan direktur
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'direktur')) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // 2. Real-time Data Fetching
  useEffect(() => {
    // Hanya jalankan jika auth sudah selesai dan user adalah direktur
    if (authLoading || !user || user.role !== 'direktur') return;

    setLoading(true);
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const txData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[];
        
        setTransactions(txData);
        setLoading(false);
        setError(null);
      }, 
      (err) => {
        console.error("Firestore Error:", err);
        setError("Gagal memuat data. Pastikan Index Firestore sudah dibuat.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  // 3. Kalkulasi Metrics (Memoized untuk performa)
  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let pendingCount = 0;
    const monthlyMap = new Map<string, { income: number; expense: number }>();
    const categoryMap = new Map<string, number>();

    transactions.forEach(tx => {
      // Totals
      if (tx.type === 'income') totalIncome += tx.amount;
      else {
        totalExpense += tx.amount;
        categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + tx.amount);
      }
      if (tx.status === 'pending') pendingCount++;

      // Chart Data
      const monthKey = tx.date?.substring(0, 7) || 'Unknown';
      if (!monthlyMap.has(monthKey)) monthlyMap.set(monthKey, { income: 0, expense: 0 });
      const mData = monthlyMap.get(monthKey)!;
      if (tx.type === 'income') mData.income += tx.amount;
      else mData.expense += tx.amount;
    });

    return {
      totalIncome,
      totalExpense,
      netIncome: totalIncome - totalExpense,
      pendingTransactions: pendingCount,
      monthlyData: Array.from(monthlyMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-6)
        .map(([month, data]) => ({ month: month.substring(5), ...data })),
      categoryBreakdown: Array.from(categoryMap.entries())
        .map(([category, value]) => ({ category, value }))
        .sort((a, b) => b.value - a.value).slice(0, 5)
    };
  }, [transactions]);

  if (authLoading || (loading && !error)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-slate-600 font-medium">Memverifikasi Akses Direktur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg">💰</div>
            <h1 className="text-lg font-bold text-slate-900 hidden sm:block">Akuntansi PDAM Seruyan</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase font-bold">Direktur</span>
            </div>
            <button onClick={logout} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><LogOut size={20}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center">
            <AlertCircle className="text-red-500 mx-auto mb-3" size={40} />
            <p className="text-red-800 font-bold">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-sm text-red-600 underline">Coba Lagi</button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="Pendapatan" value={formatCurrency(metrics.totalIncome)} color="green" icon={<ArrowUpRight/>} />
              <MetricCard title="Pengeluaran" value={formatCurrency(metrics.totalExpense)} color="red" icon={<ArrowDownLeft/>} />
              <MetricCard title="Laba Bersih" value={formatCurrency(metrics.netIncome)} color="blue" icon={<TrendingUp/>} />
              <MetricCard title="Pending" value={metrics.pendingTransactions.toString()} color="amber" icon={<Clock/>} />
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 text-lg">Tren 6 Bulan Terakhir</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `Rp${v/1000000}jt`} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={30} />
                      <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 text-lg">Kategori Pengeluaran</h3>
                <div className="space-y-5">
                  {metrics.categoryBreakdown.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500 font-medium">{item.category}</span>
                        <span className="font-bold text-slate-900">{formatCurrency(item.value)}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${(item.value / (metrics.totalExpense || 1)) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function MetricCard({ title, value, color, icon }: any) {
  const colors: any = {
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    blue: 'text-blue-600 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50'
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-xl font-black text-slate-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
    </div>
  );
}