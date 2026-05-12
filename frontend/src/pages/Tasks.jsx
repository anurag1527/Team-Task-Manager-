import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  LayoutList,
  MoreVertical,
  Briefcase
} from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'review': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-blue-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage all tasks assigned to you or your team.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all text-sm font-medium">
          <Filter size={16} />
          Filters
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Task Name</th>
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="6" className="px-6 py-8"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div></td>
                </tr>
              ))
            ) : (
              tasks.map(task => (
                <tr key={task._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getStatusStyle(task.status)} bg-opacity-20`}>
                        <CheckSquare size={18} />
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{task.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Briefcase size={14} />
                      {task.projectId?.projectName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                      <Clock size={14} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 font-bold text-xs uppercase ${getPriorityStyle(task.priority)}`}>
                      <AlertCircle size={14} />
                      {task.priority}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={task.status}
                      onChange={(e) => {
                        API.put(`/tasks/${task._id}`, { status: e.target.value })
                          .then(() => fetchTasks());
                      }}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer border-none ${getStatusStyle(task.status)}`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">In Review</option>
                      <option value="done">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && tasks.length === 0 && (
          <div className="py-20 text-center text-slate-500">No tasks found.</div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
