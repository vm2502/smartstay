import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/admin', icon: 'dashboard', label: 'Dashboard' },
  { to: '/admin/rooms', icon: 'bed', label: 'Rooms' },
  { to: '/admin/students', icon: 'group', label: 'Students' },
  { to: '/admin/payments', icon: 'payments', label: 'Payments' },
  { to: '/admin/complaints', icon: 'report_problem', label: 'Complaints' },
];

const studentLinks = [
  { to: '/student', icon: 'dashboard', label: 'Dashboard' },
  { to: '/student/complaints', icon: 'report_problem', label: 'Complaints' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-slate-50 flex flex-col border-r border-slate-200/50 z-50">
      <div className="px-6 py-8">
        <h1 className="text-lg font-black text-slate-900 tracking-tight">SmartStay</h1>
        <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-blue-600 mt-1">Digital Concierge</p>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin' || link.to === '/student'}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-6 py-3 transition-all hover:translate-x-1 duration-200 text-sm uppercase tracking-wider font-semibold ${
                isActive
                  ? "text-blue-600 before:content-[''] before:absolute before:left-0 before:w-1 before:h-6 before:bg-blue-600 before:rounded-full"
                  : 'text-slate-500 hover:text-blue-500'
              }`
            }
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-8 border-t border-slate-200/50">
        <NavLink
          to={user?.role === 'admin' ? '/admin/profile' : '/student/profile'}
          className={({ isActive }) =>
            `relative flex items-center gap-3 px-6 py-3 transition-all hover:translate-x-1 duration-200 text-sm uppercase tracking-wider font-semibold ${
              isActive ? "text-blue-600 before:content-[''] before:absolute before:left-0 before:w-1 before:h-6 before:bg-blue-600 before:rounded-full" : 'text-slate-500 hover:text-blue-500'
            }`
          }
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="text-slate-500 flex items-center gap-3 px-6 py-3 hover:text-blue-500 transition-all hover:translate-x-1 duration-200 text-sm uppercase tracking-wider font-semibold w-full"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
