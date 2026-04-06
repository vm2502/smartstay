import { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/admin').then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (!data) return <p>Failed to load dashboard.</p>;

  const chartData = data.monthlyRevenue.map(m => ({
    month: m.month.split('-')[1],
    revenue: Number(m.revenue)
  }));
  const monthNames = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold tracking-tight text-[#121c2a] mb-2">Operations Overview</h2>
        <p className="text-[#424754] max-w-2xl">Welcome back, Admin. Here is what is happening with SmartStay today.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard icon="home" iconBg="bg-blue-100" iconColor="text-blue-600" label="Total Rooms" value={data.totalRooms} sub={`${data.availableRooms} available`} />
        <MetricCard icon="person_check" iconBg="bg-orange-100" iconColor="text-orange-600" label="Occupied" value={data.occupiedRooms} progress={data.totalRooms > 0 ? Math.round((data.occupiedRooms / data.totalRooms) * 100) : 0} />
        <MetricCard icon="door_open" iconBg="bg-blue-100" iconColor="text-blue-600" label="Available" value={data.availableRooms} sub={`${data.activeComplaints} active complaints`} />
        <MetricCard icon="payments" iconBg="bg-red-100" iconColor="text-red-600" label="Pending Payments" value={`$${Number(data.pendingPayments).toLocaleString()}`} sub={`Action Required: ${data.pendingCount} students`} subColor="text-red-600" border />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8">
          {/* Revenue Chart */}
          <div className="bg-white p-8 rounded-xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h4 className="text-xl font-bold text-[#121c2a]">Monthly Revenue</h4>
                <p className="text-[#424754] text-sm">Visualizing net intake over recent months</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="month" tickFormatter={m => monthNames[parseInt(m)] || m} tick={{ fontSize: 12, fill: '#727785' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#727785' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#2170e4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Table */}
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-slate-100">
              <h4 className="text-xl font-bold text-[#121c2a]">Recent Student Arrivals</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#eff4ff]">
                  <tr>
                    <th className="px-6 py-4 text-xs text-[#424754] font-bold uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs text-[#424754] font-bold uppercase tracking-wider">Room</th>
                    <th className="px-6 py-4 text-xs text-[#424754] font-bold uppercase tracking-wider">Course</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.recentStudents.map(s => (
                    <tr key={s.student_id} className="hover:bg-[#eff4ff] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {s.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-[#121c2a]">{s.name}</p>
                            <p className="text-xs text-[#424754]">{s.student_id_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-blue-600">{s.room_number || 'Unassigned'}</td>
                      <td className="px-6 py-4 text-[#424754]">{s.course || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-8">
          {/* Concierge Insight */}
          <div className="bg-[#eff4ff] p-6 rounded-xl border border-blue-600/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-blue-600">auto_awesome</span>
              <h4 className="font-bold text-[#121c2a] tracking-tight uppercase text-xs">Concierge Insight</h4>
            </div>
            <p className="text-sm text-[#121c2a] leading-relaxed mb-4">
              Occupancy is at <span className="font-bold text-blue-600">{data.totalRooms > 0 ? Math.round((data.occupiedRooms / data.totalRooms) * 100) : 0}%</span>.
              {data.pendingCount > 0 ? ` ${data.pendingCount} pending payments require attention.` : ' All payments are up to date.'}
            </p>
          </div>

          {/* Room Allocation Donut */}
          <div className="bg-white p-6 rounded-xl">
            <h4 className="font-bold text-[#121c2a] mb-6">Room Allocation</h4>
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="#e6eeff" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="#0058be"
                  strokeDasharray={`${data.totalRooms > 0 ? Math.round((data.occupiedRooms / data.totalRooms) * 100) : 0}, 100`}
                  strokeWidth="3" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold text-[#121c2a]">{data.totalRooms > 0 ? Math.round((data.occupiedRooms / data.totalRooms) * 100) : 0}%</span>
                <span className="text-[8px] text-[#424754] font-bold uppercase">Filled</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#424754] flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-600"></span>Occupied</span>
                <span className="text-xs font-bold">{data.occupiedRooms}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#424754] flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Available</span>
                <span className="text-xs font-bold">{data.availableRooms}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl">
            <h4 className="font-bold text-[#121c2a] mb-6">Recent Activity</h4>
            <div className="space-y-6">
              {data.recentPayments.slice(0, 3).map(p => (
                <div key={p.payment_id} className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${p.status === 'paid' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                    <span className={`material-symbols-outlined text-sm ${p.status === 'paid' ? 'text-blue-600' : 'text-orange-600'}`}>payment</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#121c2a]">{p.status === 'paid' ? 'Payment Received' : 'Payment Pending'}</p>
                    <p className="text-[10px] text-[#424754]">{p.student_name} — ${p.amount} for {p.room_number}</p>
                    <p className="text-[10px] text-blue-600 font-bold mt-1">{p.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, iconBg, iconColor, label, value, sub, subColor, progress, border }) {
  return (
    <div className={`bg-white p-6 rounded-xl relative overflow-hidden group hover:bg-[#f8f9ff] transition-colors ${border ? 'border-2 border-blue-600/5' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs text-[#424754] font-bold tracking-wider uppercase">{label}</p>
        <div className={`${iconBg} p-2 rounded-lg`}>
          <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        </div>
      </div>
      <h3 className="text-5xl font-bold text-[#121c2a] tracking-tighter">{value}</h3>
      {progress !== undefined && (
        <div className="w-full bg-[#e6eeff] h-1.5 rounded-full mt-4">
          <div className="bg-orange-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      {sub && <p className={`text-xs mt-2 flex items-center gap-1 ${subColor || 'text-[#424754]'}`}>{sub}</p>}
      {progress !== undefined && <p className="text-xs text-[#424754] mt-2">{progress}% Occupancy Rate</p>}
    </div>
  );
}
