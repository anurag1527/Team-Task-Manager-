import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut,
  Zap,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'admin';

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
  ];

  return (
    <aside className="w-64 glass border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <Zap size={24} fill="currentColor" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          TaskFlow
        </span>
      </div>

      <div className="px-6 mb-4">
        <div className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit
          ${isAdmin 
            ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}
        `}>
          {isAdmin ? <ShieldCheck size={12} /> : <UserIcon size={12} />}
          {isAdmin ? 'Admin Panel' : 'Member Panel'}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }
            `}
          >
            <link.icon size={20} />
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink
            to="/users"
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }
            `}
          >
            <Users size={20} />
            <span className="font-medium">User Management</span>
          </NavLink>
        )}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 mb-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <img 
            src={user?.avatar} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full border-2 border-blue-500/20"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate">{user?.name}</span>
            <span className="text-[10px] text-slate-500 capitalize">{user?.role}</span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
