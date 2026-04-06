import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      api.get(`/dashboard/student/${user.id}`)
        .then(res => { setData(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  const student = data?.student;
  const payments = data?.payments || [];
  const complaints = data?.complaints || [];
  const roommates = data?.roommates || [];

  return (
    <div>
      {/* Welcome Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-xs text-blue-600 font-bold tracking-[0.2em] mb-2 block">STUDENT PORTAL</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#121c2a] leading-tight">
            Good Morning, {user?.name?.split(' ')[0] || 'Student'}.
          </h2>
          <p className="text-[#424754] mt-4 text-lg">
            Welcome back to your digital concierge. {student ? 'Your stay is currently fully managed.' : 'Your profile is being set up.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span> Pay Rent
          </button>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Room Card */}
        <section className="lg:col-span-7 bg-white rounded-xl p-8 flex flex-col justify-between min-h-[400px] relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-1">Your Residence</h3>
                <p className="text-3xl font-bold text-[#121c2a]">{student?.room_number || 'Not Assigned'}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <span className="material-symbols-outlined text-[32px]">bed</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-1">
                <span className="text-xs font-medium text-[#424754] uppercase">Type</span>
                <p className="text-lg font-semibold">{student?.room_type || '-'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-[#424754] uppercase">Monthly Rent</span>
                <p className="text-lg font-semibold text-blue-600">${student?.rent ? Number(student.rent).toFixed(2) : '-'}</p>
              </div>
            </div>
            {roommates.length > 0 && (
              <div className="space-y-4">
                <span className="text-xs font-medium text-[#424754] uppercase block">Roommates</span>
                {roommates.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#eff4ff] p-4 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-[#121c2a]">{r.name}</p>
                      <p className="text-sm text-[#424754]">{r.course}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="absolute -right-12 -bottom-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined text-[240px]">home_work</span>
          </div>
        </section>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Payment Status */}
          <section className="bg-white rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-widest">Payment Status</h3>
              <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            {payments.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <p className="text-2xl font-bold text-[#121c2a]">
                    {payments[0].status === 'paid' ? `Rent Paid` : `Payment ${payments[0].status}`}
                  </p>
                  <p className="text-[#424754] text-sm mt-1">${Number(payments[0].amount).toFixed(2)} — {payments[0].description}</p>
                </div>
                <div className="border-t border-slate-100 pt-6">
                  <p className="text-xs font-bold text-[#424754] uppercase">Last Payment Date</p>
                  <p className="text-lg font-bold text-blue-600">{payments[0].date}</p>
                </div>
              </div>
            ) : (
              <p className="text-[#424754]">No payments recorded yet.</p>
            )}
          </section>

          {/* Recent Complaint */}
          <section className="bg-[#eff4ff] rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Recent Activity</h3>
              <span className="material-symbols-outlined text-slate-500">history</span>
            </div>
            {complaints.length > 0 ? (
              <div className="flex gap-4">
                <div className="bg-orange-100 text-orange-700 p-3 rounded-xl h-fit">
                  <span className="material-symbols-outlined">{complaints[0].category === 'WiFi' ? 'wifi' : 'build'}</span>
                </div>
                <div>
                  <p className="font-bold text-[#121c2a]">{complaints[0].title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${complaints[0].status === 'resolved' ? 'bg-green-500' : complaints[0].status === 'in_progress' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                    <p className="text-sm font-semibold">{complaints[0].status.replace('_', ' ')}</p>
                  </div>
                  {complaints[0].description && (
                    <p className="text-sm text-[#424754] mt-3 leading-relaxed line-clamp-2">{complaints[0].description}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[#424754]">No complaints filed.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
