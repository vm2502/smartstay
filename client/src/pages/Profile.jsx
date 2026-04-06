import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full ring-4 ring-[#eff4ff] bg-blue-100 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-6xl text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
              </div>
            </div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <p className="text-xs text-[#424754] tracking-widest uppercase mb-6 font-semibold">
              {user?.role === 'admin' ? 'Administrator' : 'Student'}
            </p>
            <div className="w-full pt-6 border-t border-slate-100 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#424754]">Email</span>
                <span className="font-medium text-[#121c2a]">{user?.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#424754]">Account Status</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Verified</span>
              </div>
            </div>
          </div>

          <div className="bg-[#eff4ff] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-blue-600">verified_user</span>
              <span className="font-semibold text-sm">Security Overview</span>
            </div>
            <p className="text-sm text-[#424754] mb-4">Your account security is high. Keep your password strong and unique.</p>
          </div>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl p-8 lg:p-12">
            <form className="space-y-10">
              {/* Personal Details */}
              <section>
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h4 className="text-sm uppercase tracking-wider text-[#121c2a] font-bold">Personal Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-[#424754] uppercase font-bold">Full Name</label>
                    <input className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg focus:ring-2 focus:ring-blue-600/40 text-[#121c2a] font-medium outline-none"
                      type="text" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#424754] uppercase font-bold">Email Address</label>
                    <input className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg focus:ring-2 focus:ring-blue-600/40 text-[#121c2a] font-medium outline-none"
                      type="email" defaultValue={user?.email} />
                  </div>
                </div>
              </section>

              {/* Account Settings */}
              <section>
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                  <h4 className="text-sm uppercase tracking-wider text-[#121c2a] font-bold">Account Settings</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-[#424754] uppercase font-bold">Current Password</label>
                    <input className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg focus:ring-2 focus:ring-blue-600/40 outline-none"
                      type="password" placeholder="••••••••••••" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#424754] uppercase font-bold">New Password</label>
                    <input className="w-full px-4 py-3 bg-[#eff4ff] border-none rounded-lg focus:ring-2 focus:ring-blue-600/40 outline-none"
                      type="password" placeholder="Min. 12 characters" />
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl mt-4">
                  <span className="material-symbols-outlined text-orange-600">info</span>
                  <p className="text-xs text-orange-800 leading-relaxed">
                    Changing your password will log you out of all other active sessions.
                  </p>
                </div>
              </section>

              {/* Preferences */}
              <section>
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-1 h-6 bg-slate-400 rounded-full"></div>
                  <h4 className="text-sm uppercase tracking-wider text-[#121c2a] font-bold">System Preferences</h4>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <label className="flex items-center justify-between p-4 bg-[#eff4ff] rounded-xl cursor-pointer hover:bg-[#e6eeff] transition-colors">
                    <div className="flex flex-col">
                      <span className="font-semibold">Enable Push Notifications</span>
                      <span className="text-xs text-[#424754]">Receive alerts for complaints and payments</span>
                    </div>
                    <input defaultChecked className="h-5 w-5 rounded text-blue-600 border-none focus:ring-0" type="checkbox" />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-[#eff4ff] rounded-xl cursor-pointer hover:bg-[#e6eeff] transition-colors">
                    <div className="flex flex-col">
                      <span className="font-semibold">Weekly Report Summaries</span>
                      <span className="text-xs text-[#424754]">Receive automated revenue and occupancy PDF</span>
                    </div>
                    <input className="h-5 w-5 rounded text-blue-600 border-none focus:ring-0" type="checkbox" />
                  </label>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-end">
                <button type="button" className="px-8 py-3 rounded-lg font-semibold text-slate-400 hover:text-[#121c2a] transition-colors">
                  Discard Changes
                </button>
                <button type="button" className="bg-gradient-to-r from-[#0058be] to-[#2170e4] px-12 py-3 rounded-lg text-white font-bold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                  onClick={() => alert('Profile updated!')}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
