import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Clock, 
  MessageSquare, 
  Paperclip, 
  MoreHorizontal,
  GripVertical,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TaskCard = ({ task, isOverlay, onDelete, onUpdateStatus }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const priorityColors = {
    low: 'bg-green-500/10 text-green-600 dark:text-green-400',
    medium: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    high: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    urgent: 'bg-red-500/10 text-red-600 dark:text-red-400'
  };

  const cardContent = (
    <div 
        className={`
            bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700
            shadow-sm hover:shadow-md transition-shadow group relative
            ${isDragging ? 'opacity-30' : ''}
            ${isOverlay ? 'shadow-2xl ring-2 ring-blue-500 border-transparent' : ''}
        `}
    >
        <div className="flex items-start justify-between mb-3">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}>
                {task.priority}
            </span>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {useAuth().user.role === 'admin' && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="text-red-400 hover:text-red-600 p-1"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
                <button className="text-slate-400 hover:text-slate-600 p-1">
                    <MoreHorizontal size={16} />
                </button>
            </div>
        </div>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 leading-tight">
            {task.title}
        </h4>
        
        {/* Status Dropdown */}
        <div className="mb-4">
            <select 
                value={task.status}
                onChange={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(task._id, e.target.value);
                }}
                className="w-full text-[10px] font-bold uppercase bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
            >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Completed</option>
            </select>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
            {task.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3 text-slate-400">
                <div className="flex items-center gap-1 text-[10px]">
                    <MessageSquare size={12} />
                    <span>{task.comments?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                    <Paperclip size={12} />
                    <span>{task.attachments?.length || 0}</span>
                </div>
            </div>
            
            <div className="flex -space-x-2">
                {task.assignedTo?.map((u, i) => (
                    <img key={i} src={u.avatar} className="w-6 h-6 rounded-full border border-white dark:border-slate-800" title={u.name} />
                ))}
            </div>
        </div>

        {task.dueDate && (
            <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                <Clock size={12} />
                {new Date(task.dueDate).toLocaleDateString()}
            </div>
        )}

        <div 
            {...attributes} 
            {...listeners}
            className="absolute top-4 right-1 p-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 md:opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <GripVertical size={14} />
        </div>
    </div>
  );

  if (isOverlay) return cardContent;

  return (
    <div ref={setNodeRef} style={style}>
        {cardContent}
    </div>
  );
};

export default TaskCard;
