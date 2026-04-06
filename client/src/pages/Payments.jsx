import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ student_id: '', amount: '', status: 'paid', date: new Date().toISOString().split('T')[0], description: 'Monthly Rent' });

  const fetchPayments = () => {
    api.get('/payments', { params: filter ? { status: filter } : {} })
      .then(res => { setPayments(res.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetchPayments, [filter]);
  useEffect(() => { api.get('/students').then(res => setStudents(res.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments', form);
      setShowModal(false);
      setForm({ student_id: '', amount: '', status: 'paid', date: new Date().toISOString().split('T')[0], description: 'Monthly Rent' });
      fetchPayments();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0);
  const pendingDues = payments.filter(p => p.status !== 'paid').reduce((s, p) => s + Number(p.amount), 0);
  const pendingCount = payments.filter(p => p.status !== 'paid').length;
  const statusColor = { paid: 'bg-green-100 text-green-700', pending: 'bg-orange-100 text-orange-700', overdue: 'bg-red-100 text-red-700' };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-xl flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <div className="bg-blue-100 p-3 rounded-xl"><span className="material-symbols-outlined text-blue-600">account_balance_wallet</span></div>
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Total</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#424754] uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-4xl font-bold text-[#121c2a] mt-1">${totalRevenue.toLocaleString()}<span className="text-lg text-slate-400 font-normal">.00</span></h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-xl flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <div className="bg-red-100 p-3 rounded-xl text-red-600"><span className="material-symbols-outlined">pending_actions</span></div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">{pendingCount} Pending</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#424754] uppercase tracking-wider">Pending Dues</p>
            <h3 className="text-4xl font-bold text-[#121c2a] mt-1">${pendingDues.toLocaleString()}<span className="text-lg text-slate-400 font-normal">.00</span></h3>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white p-8 rounded-xl flex flex-col justify-between h-48 shadow-xl shadow-blue-600/10">
          <div className="flex justify-between items-start">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm"><span className="material-symbols-outlined">stars</span></div>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full uppercase">
              {payments.length > 0 ? Math.round((payments.filter(p => p.status === 'paid').length / payments.length) * 100) : 0}% Collection
            </span>
          </div>
          <div>
            <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Collection Efficiency</p>
            <div className="flex items-center gap-4 mt-1">
              <h3 className="text-4xl font-bold">{payments.length > 0 && payments.filter(p => p.status === 'paid').length / payments.length >= 0.9 ? 'Excellent' : 'Good'}</h3>
              <span className="material-symbols-outlined text-3xl">trending_up</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-[#e6eeff] flex justify-between items-center">
          <div>
            <h4 className="text-lg font-bold text-[#121c2a]">Payment History</h4>
            <p className="text-sm text-[#424754]">Manage and track all student financial transactions</p>
          </div>
          <div className="flex gap-2">
            <select className="bg-[#eff4ff] border-none text-sm font-semibold px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-600/20 outline-none"
              value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="overdue">Overdue</option>
            </select>
            <button onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20">
              <span className="material-symbols-outlined text-lg">add</span> Add Payment
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#eff4ff]/50">
                <th className="px-8 py-4 text-xs font-bold text-[#424754] uppercase tracking-widest">ID</th>
                <th className="px-8 py-4 text-xs font-bold text-[#424754] uppercase tracking-widest">Student</th>
                <th className="px-8 py-4 text-xs font-bold text-[#424754] uppercase tracking-widest">Room</th>
                <th className="px-8 py-4 text-xs font-bold text-[#424754] uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-xs font-bold text-[#424754] uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-[#424754] uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6eeff]">
              {payments.map(p => (
                <tr key={p.payment_id} className="hover:bg-[#eff4ff] transition-colors">
                  <td className="px-8 py-5 text-sm font-mono text-blue-600 font-bold">#SS-{String(p.payment_id).padStart(4,'0')}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">{(p.student_name||'?')[0]}</div>
                      <span className="text-sm font-semibold text-[#121c2a]">{p.student_name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-[#424754]">{p.room_number || '-'}</td>
                  <td className="px-8 py-5 text-sm font-bold text-[#121c2a]">${Number(p.amount).toFixed(2)}</td>
                  <td className="px-8 py-5 text-sm text-[#424754]">{p.date}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusColor[p.status] || 'bg-slate-100 text-slate-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'paid' ? 'bg-green-500' : p.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-[#eff4ff]/30 border-t border-[#e6eeff] text-xs font-medium text-[#424754]">
          Showing {payments.length} transactions
        </div>
      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-6">Record Payment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#424754]">Student</label>
                <select className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                  value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} required>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.student_id} value={s.student_id}>{s.name} ({s.student_id_number})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#424754]">Amount ($)</label>
                  <input type="number" className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                    value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required min="0" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#424754]">Status</label>
                  <select className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                    value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="paid">Paid</option><option value="pending">Pending</option><option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#424754]">Date</label>
                  <input type="date" className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                    value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#424754]">Description</label>
                  <input className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                    value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg font-semibold text-[#424754] hover:bg-slate-100">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white font-bold rounded-lg shadow-lg">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
