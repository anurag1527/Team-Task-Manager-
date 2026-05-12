import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  BarChart3,
  Users as UsersIcon,
  Briefcase,
  Zap,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    totalProjects: 0,
    totalUsers: 0,
    tasksByStatus: [],
    tasksPerUser: []
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    // Listen for real-time updates on the dashboard
    const socket = io('http://localhost:5000');
    socket.on('task-updated-global', () => {
      fetchDashboardData();
    });

    return () => socket.close();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        API.get('/tasks'),
        API.get('/projects'),
        user.role === 'admin' ? API.get('/users') : Promise.resolve({ data: [] })
      ]);

      const tasksData = tasksRes.data;
      setTasks(tasksData);
      const completed = tasksData.filter(t => t.status === 'done').length;
      const overdue = tasksData.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length;

      // Group tasks by status
      const statusCounts = {
        todo: tasksData.filter(t => t.status === 'todo').length,
        'in-progress': tasksData.filter(t => t.status === 'in-progress').length,
        review: tasksData.filter(t => t.status === 'review').length,
        done: tasksData.filter(t => t.status === 'done').length,
      };

      const tasksByStatus = [
        { name: 'To Do', value: statusCounts.todo, color: '#64748b' },
        { name: 'In Progress', value: statusCounts['in-progress'], color: '#3b82f6' },
        { name: 'Review', value: statusCounts.review, color: '#8b5cf6' },
        { name: 'Done', value: statusCounts.done, color: '#22c55e' },
      ].filter(item => item.value > 0);

      // Group tasks by user (for Admin)
      let tasksPerUser = [];
      if (user.role === 'admin' && usersRes.data.length > 0) {
          tasksPerUser = usersRes.data.map(u => {
              const count = tasksData.filter(t => t.assignedTo.some(at => at._id === u._id)).length;
              return { name: u.name.split(' ')[0], tasks: count };
          }).filter(u => u.tasks > 0);
      }

      setStats({
        totalTasks: tasksData.length,
        completedTasks: completed,
        pendingTasks: tasksData.length - completed,
        overdueTasks: overdue,
        totalProjects: projectsRes.data.length,
        totalUsers: usersRes.data.length || 1,
        tasksByStatus,
        tasksPerUser
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
          {Icon ? <Icon size={24} /> : <Zap size={24} />}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-500 text-sm font-bold bg-green-500/10 px-2 py-1 rounded-full">
            <TrendingUp size={14} />
            {trend}%
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </div>
    </div>
  );

  const exportToCSV = () => {
    const headers = ['Task Title', 'Project', 'Status', 'Priority', 'Due Date', 'Assignee'];
    const rows = tasks.map(t => [
      t.title,
      t.projectId?.projectName || 'N/A',
      t.status,
      t.priority,
      new Date(t.dueDate).toLocaleDateString(),
      t.assignedTo.map(u => u.name).join(', ')
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `task_report_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8">Loading Dashboard...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {user.role === 'admin' ? 'Admin Control Center' : 'My Workspace'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {user.role === 'admin' 
              ? 'Real-time overview of all team activity and project progress.' 
              : 'Track your assigned tasks and project contributions.'}
          </p>
        </div>
        {user.role === 'admin' && (
            <div className="flex gap-3">
                <button onClick={exportToCSV} className="btn btn-secondary">Export Data</button>
                <button onClick={exportToCSV} className="btn btn-primary">Create Report</button>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tasks" 
          value={stats.totalTasks} 
          icon={BarChart3} 
          color="text-blue-600 bg-blue-600" 
        />
        <StatCard 
          title="Completed" 
          value={stats.completedTasks} 
          icon={CheckCircle2} 
          color="text-green-600 bg-green-600"
        />
        <StatCard 
          title="Pending" 
          value={stats.pendingTasks} 
          icon={Clock} 
          color="text-amber-600 bg-amber-600" 
        />
        <StatCard 
          title="Overdue" 
          value={stats.overdueTasks} 
          icon={AlertCircle} 
          color="text-red-600 bg-red-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tasks by Status Chart */}
        <div className="card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <PieIcon className="text-blue-500" />
            Tasks by Status
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.tasksByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.tasksByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Admin only: Tasks per User */}
        {user.role === 'admin' ? (
          <div className="card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UsersIcon className="text-purple-500" />
              Tasks per Team Member
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.tasksPerUser}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="card p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-center items-center text-center space-y-4">
             <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                <Zap size={40} className="text-yellow-400" />
             </div>
             <h3 className="text-2xl font-bold">Member Spotlight</h3>
             <p className="text-slate-400 max-w-xs">
                You have completed {stats.completedTasks} tasks this month. Keep up the great work to stay ahead of your deadlines!
             </p>
             <button className="btn bg-white text-slate-900 hover:bg-slate-100 mt-4">
                View My Goals
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
