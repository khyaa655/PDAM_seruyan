import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';
import { 
  TrendingUp, TrendingDown, DollarSign, Package, 
  AlertCircle, CheckSquare, Users, Activity
} from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../../authContext';

export default function DashboardUtama() {
  const { user } = useAuth();
  const isStaff = user?.role === 'staff';

  const [stats, setStats] = useState({
    income: 0,
    expense: 0,
    assets: 0,
    tasksPending: 0,
    pengaduanPending: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Transactions
    const unsubTx = onSnapshot(query(collection(db, 'transactions')), (snapshot) => {
      let totalInc = 0;
      let totalExp = 0;
      const monthly = new Map<string, { income: number; expense: number }>();

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.type === 'income') totalInc += data.amount || 0;
        else totalExp += data.amount || 0;

        // For Chart
        if (data.date) {
          const month = data.date.substring(0, 7); // YYYY-MM
          if (!monthly.has(month)) monthly.set(month, { income: 0, expense: 0 });
          if (data.type === 'income') monthly.get(month)!.income += data.amount || 0;
          else monthly.get(month)!.expense += data.amount || 0;
        }
      });

      const formattedChart = Array.from(monthly.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-6)
        .map(([month, data]) => ({ name: month, Pemasukan: data.income, Pengeluaran: data.expense }));

      setStats(s => ({ ...s, income: totalInc, expense: totalExp }));
      setChartData(formattedChart);
    });

    // Listen to Assets
    const unsubAssets = onSnapshot(collection(db, 'assets'), (snapshot) => {
      let totalAssetValue = 0;
      snapshot.forEach(doc => {
        totalAssetValue += doc.data().nilaiBuku || doc.data().hargaPerolehan || 0;
      });
      setStats(s => ({ ...s, assets: totalAssetValue }));
    });

    // Listen to Tasks
    const unsubTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      let pending = 0;
      snapshot.forEach(doc => {
        if (doc.data().status !== 'completed') pending++;
      });
      setStats(s => ({ ...s, tasksPending: pending }));
    });

    // Listen to Pengaduan
    const unsubPengaduan = onSnapshot(collection(db, 'pengaduan'), (snapshot) => {
      let pending = 0;
      snapshot.forEach(doc => {
        if (doc.data().status === 'Menunggu') pending++;
      });
      setStats(s => ({ ...s, pengaduanPending: pending }));
      setLoading(false);
    });

    return () => {
      unsubTx();
      unsubAssets();
      unsubTasks();
      unsubPengaduan();
    };
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold">Memuat Dashboard...</div>;
  }

  if (isStaff) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-end mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-800">Dashboard Utama</h2>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Periode Aktif: 2026</span>
          </div>
        </div>
        
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Monitoring Operasional</h3>
          <p className="text-slate-500 max-w-md">Anda login menggunakan peran <span className="font-bold text-blue-600">STAFF</span>. Visualisasi laporan laba rugi dan posisi kas disembunyikan.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">Fixed Assets</p>
              <p className="text-4xl font-black text-slate-800 mb-2">4</p>
              <p className="text-sm font-bold text-slate-500">KATEGORI ASET TERDAFTAR</p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">Nilai Buku Aset</span>
              <span className="text-sm font-bold text-emerald-600">Rp 0</span>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl shadow-sm text-white flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-6">Inventory Status</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-bold text-slate-300">Stok Aman <span className="text-slate-500 font-normal">(1.1.5)</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-bold text-slate-300">Valuasi Stok</span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-3xl font-black text-white">Rp 0</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Utama</h2>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Periode Aktif: 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Laba Rugi Berjalan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Laba Rugi Berjalan</p>
              <p className="text-[10px] text-slate-400 italic mt-1">Terdiri dari Pendapatan Air & Non-Air</p>
            </div>
            <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
              <TrendingUp size={12} /> Aktif
            </span>
          </div>
          <p className="text-4xl font-black text-slate-800 mb-8">{formatCurrency(stats.income - stats.expense)}</p>
          <div className="flex gap-2">
             <div className="h-1.5 flex-1 bg-slate-100 rounded-full"></div>
             <div className="h-1.5 w-1/3 bg-blue-600 rounded-full"></div>
          </div>
        </div>

        {/* Posisi Kas */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-6">Posisi Kas</p>
          <p className="text-3xl font-black text-slate-800 mb-6">Rp 0</p>
          <div className="space-y-4">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-500">Bank <span className="text-slate-400 font-normal">(1.1.1)</span></span>
              <span className="font-bold text-slate-800">Rp 0</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-500">Kas Ditangan <span className="text-slate-400 font-normal">(1.1.2)</span></span>
              <span className="font-bold text-slate-800">Rp 0</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-bold text-blue-600">Kas Transit (1.1.6)</span>
              <span className="font-bold text-blue-600">Rp 0</span>
            </div>
            <p className="text-[9px] text-slate-400 italic -mt-3">Uang di brankas (belum setor)</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Liquid</span>
          </div>
        </div>

        {/* Total Piutang */}
        <div className="bg-blue-600 p-6 rounded-3xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold text-blue-200 tracking-wider uppercase mb-8">Total Piutang (AR)</p>
            <p className="text-4xl font-black text-white mb-2">Rp 0</p>
            <p className="text-sm font-medium text-blue-200">Estimasi tagihan Macet Air</p>
          </div>
          <div className="relative z-10 mt-8 flex justify-between items-end">
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Live Data</span>
            <TrendingUp className="text-blue-300" size={20} />
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full opacity-50 blur-2xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-lg font-bold text-slate-800">Performa Keuangan</p>
                <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mt-1">Pendapatan VS Beban (6 Bulan Terakhir)</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full flex items-center gap-1"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Pendapatan</span>
                <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase rounded-full flex items-center gap-1"><div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div> Beban</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => `Rp ${val/1000000}Jt`} />
                  <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} formatter={(value: number) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="Pemasukan" stroke="#2563eb" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="Pengeluaran" stroke="#cbd5e1" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Efisiensi Operasional */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">Efisiensi Operasional</p>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mt-1">Rasio Beban Terhadap Pendapatan</p>
            </div>
            <div className="flex items-center gap-4 w-1/2">
              <span className="text-xl font-black text-slate-800">0% <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">Opex Ratio</span></span>
              <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600 w-0"></div>
              </div>
              <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase">Sehat</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Fixed Assets */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[200px]">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">Fixed Assets</p>
              <p className="text-4xl font-black text-slate-800 mb-2">4</p>
              <p className="text-sm font-bold text-slate-500">KATEGORI ASET TERDAFTAR</p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">Nilai Buku Aset</span>
              <span className="text-sm font-bold text-emerald-600">Rp 0</span>
            </div>
          </div>

          {/* Inventory Status */}
          <div className="bg-slate-900 p-6 rounded-3xl shadow-sm text-white flex flex-col justify-between min-h-[200px]">
            <div>
              <p className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-6">Inventory Status</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-bold text-slate-300">Stok Aman <span className="text-slate-500 font-normal">(1.1.5)</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-bold text-slate-300">Valuasi Stok</span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-3xl font-black text-white">Rp 0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

