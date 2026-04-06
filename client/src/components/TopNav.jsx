import { useAuth } from '../context/AuthContext';

export default function TopNav({ title }) {
  const { user } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md flex justify-between items-center w-full px-8 py-4 z-40 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="bg-[#eff4ff] px-4 py-2 rounded-xl flex items-center gap-3 w-96">
          <span className="material-symbols-outlined text-[#727785]">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full text-[#121c2a]"
            placeholder="Search students, rooms, or transactions..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100/50 transition-colors rounded-lg active:scale-95 duration-200">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-500 uppercase font-semibold mt-1">
              {user?.role === 'admin' ? 'Super Admin' : 'Student'}
            </p>
          </div>
          <span className="material-symbols-outlined text-3xl text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_circle
          </span>
        </div>
      </div>
    </header>
  );
}
