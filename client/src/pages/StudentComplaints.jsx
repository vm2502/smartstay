import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function StudentComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'General' });

  useEffect(() => {
    if (user?.id) {
      api.get(`/dashboard/student/${user.id}`).then(res => {
        const sid = res.data.student?.student_id;
        setStudentId(sid);
        setComplaints(res.data.complaints || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return alert('Student profile not found.');
    try {
      await api.post('/complaints', { ...form, student_id: studentId });
      setShowModal(false);
      setForm({ title: '', description: '', category: 'General' });
      // Refresh
      const res = await api.get(`/dashboard/student/${user.id}`);
      setComplaints(res.data.complaints || []);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const statusColor = { pending: 'bg-red-100 text-red-700', in_progress: 'bg-orange-100 text-orange-700', resolved: 'bg-green-100 text-green-700' };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#121c2a]">My Complaints</h2>
          <p className="text-[#424754] mt-1">Track and submit facility requests.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20">
          <span className="material-symbols-outlined">add_comment</span> Raise Complaint
        </button>
      </div>

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="bg-white p-12 rounded-xl text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">sentiment_satisfied</span>
            <p className="text-[#424754] text-lg">No complaints yet. All good!</p>
          </div>
        ) : complaints.map(c => (
          <div key={c.complaint_id} className="bg-white p-6 rounded-xl flex items-start gap-4 hover:shadow-md transition-all">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl shrink-0">
              <span className="material-symbols-outlined">
                {c.category === 'WiFi' ? 'wifi' : c.category === 'Electrical' ? 'bolt' : c.category === 'Plumbing' ? 'water_drop' : 'build'}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-[#121c2a]">{c.title}</h4>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor[c.status] || 'bg-slate-100'}`}>
                  {c.status.replace('_', ' ')}
                </span>
              </div>
              {c.description && <p className="text-sm text-[#424754] mt-2">{c.description}</p>}
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                <span className="font-semibold">{c.category}</span>
                <span>•</span>
                <span>{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-6">Raise a Complaint</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white font-bold rounded-lg shadow-lg">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
