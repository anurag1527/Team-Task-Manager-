import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { 
  Plus, 
  Search, 
  Users, 
  Settings, 
  Filter,
  Calendar,
  Zap,
  UserPlus
} from 'lucide-react';
import KanbanColumn from '../components/Kanban/KanbanColumn';
import TaskCard from '../components/Kanban/TaskCard';
import TaskModal from '../components/Modals/TaskModal';
import MemberModal from '../components/Modals/MemberModal';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const isAdmin = user?.role === 'admin';

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-500' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
    { id: 'review', title: 'In Review', color: 'bg-purple-500' },
    { id: 'done', title: 'Completed', color: 'bg-green-500' }
  ];

  useEffect(() => {
    fetchProjectDetails();
    
    const newSocket = io('http://localhost:5000');

    newSocket.emit('join-project', id);

    newSocket.on('task-updated', (updatedTask) => {
      setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
    });

    newSocket.on('task-created', (newTask) => {
        if (newTask.projectId === id) {
            setTasks(prev => [...prev.filter(t => t._id !== newTask._id), newTask]);
        }
    });

    newSocket.on('task-deleted', (taskId) => {
      setTasks(prev => prev.filter(t => t._id !== taskId));
    });

    return () => newSocket.close();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const { data } = await API.get(`/projects/${id}`);
      setProject(data.project);
      
      // Strict Privacy: Members only see their own tasks even in the project view
      if (user.role === 'admin') {
        setTasks(data.tasks);
      } else {
        const myTasks = data.tasks.filter(t => 
          t.assignedTo.some(at => at._id.toString() === user._id.toString())
        );
        setTasks(myTasks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    if (!task) return;
    
    // Members can only drag their own tasks - using .toString() for safe comparison
    if (!isAdmin && !task.assignedTo.some(at => at._id.toString() === user._id.toString())) {
        return;
    }
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Dropping a task over another task
    if (isActiveATask && isOverATask) {
        setTasks(prev => {
            const activeIndex = prev.findIndex(t => t._id === activeId);
            const overIndex = prev.findIndex(t => t._id === overId);

            if (prev[activeIndex].status !== prev[overIndex].status) {
                prev[activeIndex].status = prev[overIndex].status;
                return arrayMove(prev, activeIndex, overIndex);
            }
            return arrayMove(prev, activeIndex, overIndex);
        });
    }

    // Dropping a task over a column
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveATask && isOverAColumn) {
        setTasks(prev => {
            const activeIndex = prev.findIndex(t => t._id === activeId);
            prev[activeIndex].status = overId;
            return arrayMove(prev, activeIndex, activeIndex);
        });
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const task = tasks.find(t => t._id === active.id);
    const newStatus = over.data.current?.type === "Column" ? over.id : over.data.current?.task?.status;

    if (task.status !== newStatus) {
        handleUpdateStatus(task._id, newStatus);
    }
    
    setActiveTask(null);
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
        const { data } = await API.put(`/tasks/${taskId}`, { status: newStatus });
        setTasks(prev => prev.map(t => t._id === taskId ? data : t));
    } catch (err) {
        console.error("Failed to update task status", err);
        fetchProjectDetails();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
        await API.delete(`/tasks/${taskId}`);
        setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err) {
        console.error("Failed to delete task", err);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Delete this entire project? This cannot be undone.')) return;
    try {
        await API.delete(`/projects/${id}`);
        window.location.href = '/projects';
    } catch (err) {
        console.error("Failed to delete project", err);
    }
  };

  if (loading) return <div className="p-8">Loading Project...</div>;

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-sm text-slate-500 mb-1">
            <span>Projects</span>
            <span>/</span>
            <span className="font-medium text-slate-900 dark:text-white">{project?.projectName}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{project?.projectName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-4">
            {project?.members?.map((m, i) => (
               <img key={i} src={m.avatar} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950" title={m.name} />
            ))}
            {isAdmin && (
                <button 
                    onClick={() => setShowMemberModal(true)}
                    className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white dark:border-slate-950 flex items-center justify-center text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
                >
                    <Plus size={18} />
                </button>
            )}
          </div>
          {isAdmin && (
            <>
                <button className="btn btn-secondary text-red-500 border-red-200 hover:bg-red-50 flex items-center gap-2" onClick={handleDeleteProject}>
                    Delete Project
                </button>
                <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
                    <Plus size={18} />
                    Add Task
                </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
         <div className="flex items-center gap-6">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input type="text" placeholder="Search tasks..." className="pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none text-sm w-64 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
               <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <Filter size={14} /> Filter
               </button>
               <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <Users size={14} /> Assignee
               </button>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 min-w-max h-full">
            {columns.map(col => (
              <KanbanColumn 
                key={col.id} 
                column={col} 
                tasks={tasks.filter(t => t.status === col.id)} 
                onDeleteTask={handleDeleteTask}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modals */}
      <TaskModal 
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        projectId={id}
        members={project?.members}
        onTaskCreated={(newTask) => setTasks(prev => [...prev, newTask])}
      />

      <MemberModal 
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        project={project}
        onMemberAdded={(newMembers) => setProject({...project, members: newMembers})}
      />
    </div>
  );
};

export default ProjectDetails;
