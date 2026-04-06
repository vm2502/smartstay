import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ student_id: '', title: '', description: '', category: 'General' });

  const fetchComplaints = () => {
    api.get('/complaints').then(res => { setComplaints(res.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetchComplaints, []);
  useEffect(() => { api.get('/students').then(res => setStudents(res.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', form);
      setShowModal(false);
      setForm({ student_id: '', title: '', description: '', category: 'General' });
      fetchComplaints();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/complaints/${id}`, { status });
    fetchComplaints();
  };

  const pending = complaints.filter(c => c.status === 'pending');
  const inProgress = complaints.filter(c => c.status === 'in_progress');
  const resolved = complaints.filter(c => c.status === 'resolved');

  const catColor = {
    Plumbing: 'bg-orange-100 text-orange-700',
    Electrical: 'bg-blue-100 text-blue-700',
    WiFi: 'bg-slate-200 text-slate-700',
    Cleaning: 'bg-green-100 text-green-700',
    Maintenance: 'bg-purple-100 text-purple-700',
    General: 'bg-slate-100 text-slate-600'
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#121c2a]">Ticket Resolution</h2>
          <p className="text-[#424754] mt-1">Manage and track student facility requests.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20">
          <span className="material-symbols-outlined">add</span> New Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase tracking-wider font-bold text-[#424754]">Pending</span>
            <div className="p-2 bg-blue-100 rounded-lg"><span className="material-symbols-outlined text-blue-600">assignment</span></div>
          </div>
          <span className="text-4xl font-bold tracking-tight">{pending.length}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase tracking-wider font-bold text-[#424754]">In Progress</span>
            <div className="p-2 bg-orange-100 rounded-lg"><span className="material-symbols-outlined text-orange-600">timer</span></div>
          </div>
          <span className="text-4xl font-bold tracking-tight">{inProgress.length}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase tracking-wider font-bold text-[#424754]">Resolved</span>
            <div className="p-2 bg-green-100 rounded-lg"><span className="material-symbols-outlined text-green-600">check_circle</span></div>
          </div>
          <span className="text-4xl font-bold tracking-tight">{resolved.length}</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-6" style={{ minHeight: '500px' }}>
        {/* Pending */}
        <KanbanColumn title="Pending" count={pending.length} items={pending} catColor={catColor}
          onStatusChange={(id) => updateStatus(id, 'in_progress')} nextStatus="Start" />
        {/* In Progress */}
        <KanbanColumn title="In Progress" count={inProgress.length} items={inProgress} catColor={catColor}
          onStatusChange={(id) => updateStatus(id, 'resolved')} nextStatus="Resolve" highlight />
        {/* Resolved */}
        <KanbanColumn title="Resolved" count={resolved.length} items={resolved} catColor={catColor} resolved />
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-6">Raise New Ticket</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#424754]">Student</label>
                <select className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                  value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} required>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.student_id} value={s.student_id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-[#424754]">Title</label>
                <input className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                  value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-[#424754]">Description</label>
                <textarea rows="3" className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none resize-none"
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-[#424754]">Category</label>
                <select className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                  value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option>General</option><option>Plumbing</option><option>Electrical</option><option>WiFi</option><option>Cleaning</option><option>Maintenance</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg font-semibold text-[#424754] hover:bg-slate-100">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white font-bold rounded-lg shadow-lg">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ title, count, items, catColor, onStatusChange, nextStatus, highlight, resolved: isResolved }) {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <h3 className={`font-bold ${isResolved ? 'text-slate-400' : 'text-[#121c2a]'}`}>{title}</h3>
          <span className="px-2 py-0.5 bg-[#d9e3f6] text-xs font-bold rounded-full">{count}</span>
        </div>
      </div>
      <div className={`flex flex-col gap-4 overflow-y-auto pr-1 ${isResolved ? 'opacity-60 hover:opacity-100 transition-all' : ''}`}>
        {items.map(c => (
          <div key={c.complaint_id} className={`bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group ${highlight ? 'border-l-4 border-blue-600' : ''}`}>
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${catColor[c.category] || 'bg-slate-100 text-slate-600'}`}>
                {c.category}
              </span>
              <span className="text-[10px] font-semibold text-[#727785]">#ST-{String(c.complaint_id).padStart(4, '0')}</span>
            </div>
            <h4 className={`font-bold text-[#121c2a] group-hover:text-blue-600 transition-colors ${isResolved ? 'line-through text-slate-500' : ''}`}>
              {c.title}
            </h4>
            {c.description && <p className="text-sm text-[#424754] mt-2 line-clamp-2">{c.description}</p>}
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#dee9fc] flex items-center justify-center text-[10px] font-bold">
                  {(c.student_name || '?')[0]}
                </div>
                <span className="text-xs font-semibold text-[#121c2a]">{c.student_name || 'Unknown'} ({c.room_number || '-'})</span>
              </div>
            </div>
            {onStatusChange && (
              <button onClick={() => onStatusChange(c.complaint_id)}
                className="mt-3 w-full py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                {nextStatus} →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
