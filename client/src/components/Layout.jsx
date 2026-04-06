import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function Layout() {
  return (
    <div className="bg-[#f8f9ff] min-h-screen">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <TopNav />
        <div className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
