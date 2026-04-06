import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm] = useState({ room_number: '', type: 'Standard', capacity: 2, rent: 450, status: 'available' });

  const fetchRooms = () => {
    api.get('/rooms').then(res => { setRooms(res.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetchRooms, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editRoom) {
        await api.put(`/rooms/${editRoom.room_id}`, form);
      } else {
        await api.post('/rooms', form);
      }
      setShowModal(false); setEditRoom(null);
      setForm({ room_number: '', type: 'Standard', capacity: 2, rent: 450, status: 'available' });
      fetchRooms();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (room) => {
    setEditRoom(room);
    setForm({ room_number: room.room_number, type: room.type, capacity: room.capacity, rent: room.rent, status: room.status });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    await api.delete(`/rooms/${id}`);
    fetchRooms();
  };

  const statusColor = { available: 'bg-green-100 text-green-700', occupied: 'bg-orange-100 text-orange-700', maintenance: 'bg-red-100 text-red-700' };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#121c2a]">Room Management</h2>
          <p className="text-[#424754] mt-1">Manage {rooms.length} rooms across all wings.</p>
        </div>
        <button onClick={() => { setEditRoom(null); setForm({ room_number: '', type: 'Standard', capacity: 2, rent: 450, status: 'available' }); setShowModal(true); }}
          className="bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-sm">add</span> Add Room
        </button>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {rooms.map(room => (
          <div key={room.room_id} className="bg-white p-6 rounded-xl hover:shadow-xl hover:shadow-blue-600/5 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <span className="material-symbols-outlined text-2xl">bed</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${statusColor[room.status] || 'bg-slate-100 text-slate-600'}`}>
                {room.status}
              </span>
            </div>
            <h3 className="font-bold text-lg text-[#121c2a]">{room.room_number}</h3>
            <p className="text-sm text-[#424754]">{room.type}</p>

            <div className="mt-6 pt-4 border-t border-slate-50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Capacity</span>
                <span className="font-semibold">{room.capacity} beds</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Occupants</span>
                <span className="font-semibold">{room.current_occupants || 0} / {room.capacity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Rent</span>
                <span className="font-semibold text-blue-600">${Number(room.rent).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => handleEdit(room)}
                className="flex-1 py-2 bg-[#eff4ff] text-blue-600 text-sm font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                Edit
              </button>
              <button onClick={() => handleDelete(room.room_id)}
                className="py-2 px-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-6">{editRoom ? 'Edit Room' : 'Add New Room'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#424754]">Room Number</label>
                <input className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                  value={form.room_number} onChange={e => setForm({...form, room_number: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#424754]">Type</label>
                  <select className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                    value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option>Standard</option><option>Premium</option><option>Suite</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#424754]">Capacity</label>
                  <input type="number" className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                    value={form.capacity} onChange={e => setForm({...form, capacity: parseInt(e.target.value)})} min="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#424754]">Rent ($)</label>
                  <input type="number" className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                    value={form.rent} onChange={e => setForm({...form, rent: parseFloat(e.target.value)})} min="0" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#424754]">Status</label>
                  <select className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg mt-1 focus:ring-2 focus:ring-blue-600/40 outline-none"
                    value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="available">Available</option><option value="occupied">Occupied</option><option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg font-semibold text-[#424754] hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white font-bold rounded-lg shadow-lg">
                  {editRoom ? 'Save Changes' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
