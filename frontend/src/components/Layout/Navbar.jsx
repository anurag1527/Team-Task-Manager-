import React, { useState, useEffect } from 'react';
import { Bell, Search, Moon, Sun, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="h-16 glass border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks, projects..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="relative">
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
        
          <span className="text-sm font-medium hidden md:block">
            {user?.name ? `Welcome, ${user.name.split(' ')[0]}` : 'Welcome'}
          </span>
      </div>
    </header>
  );
};

export default Navbar;
