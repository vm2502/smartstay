import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', student_id_number: '', contact: '', room_id: '', course: '' });

  const fetchStudents = () => {
    api.get('/students', { params: search ? { search } : {} })
      .then(res => { setStudents(res.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetchStudents, [search]);
  useEffect(() => { api.get('/rooms').then(res => setRooms(res.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students', form);
      setShowModal(false);
      setForm({ name: '', student_id_number: '', contact: '', room_id: '', course: '' });
      fetchStudents();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return;
    await api.delete(`/students/${id}`);
    fetchStudents();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#121c2a]">Student Directory</h2>
          <p className="text-[#424754] mt-1">Manage and track {students.length} active residents across all wings.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input className="pl-10 pr-4 py-2 bg-[#eff4ff] border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 text-sm w-64 outline-none"
              placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-sm">add</span> Add Student
          </button>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {students.map(s => (
          <div key={s.student_id} className="bg-white p-6 rounded-xl hover:shadow-xl hover:shadow-blue-600/5 transition-all group relative">
            <div className="flex items-start justify-between mb-4">
              <div className="h-16 w-16 rounded-2xl ring-4 ring-[#e6eeff] bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold tracking-wider uppercase">
                Occupied
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-[#121c2a] leading-tight">{s.name}</h3>
              <p className="text-sm text-[#424754] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                {s.student_id_number}
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Assigned Room</span>
                <span className="font-semibold text-blue-600">{s.room_number || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Course</span>
                <span className="font-semibold">{s.course || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Contact</span>
                <span className="font-medium text-[#424754]">{s.contact || '-'}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 bg-[#eff4ff] text-blue-600 text-sm font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                View Profile
              </button>
              <button onClick={() => handleDelete(s.student_id)}
                className="py-2 px-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-6">New Student Registration</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#424754]">Full Name</label>
                <input className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#424754]">Student ID</label>
                  <input className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                    placeholder="STU-XXXXX" value={form.student_id_number} onChange={e => setForm({...form, student_id_number: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#424754]">Contact</label>
                  <input className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                    value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#424754]">Room</label>
                  <select className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                    value={form.room_id} onChange={e => setForm({...form, room_id: e.target.value})}>
                    <option value="">Unassigned</option>
                    {rooms.filter(r => r.status === 'available' || r.current_occupants < r.capacity).map(r => (
                      <option key={r.room_id} value={r.room_id}>{r.room_number} ({r.type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#424754]">Course</label>
                  <input className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                    value={form.course} onChange={e => setForm({...form, course: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg font-semibold text-[#424754] hover:bg-slate-100">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white font-bold rounded-lg shadow-lg">Register Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
