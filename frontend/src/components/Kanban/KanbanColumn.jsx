import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Plus, MoreHorizontal } from 'lucide-react';

const KanbanColumn = ({ column, tasks, onDeleteTask, onUpdateStatus }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const taskIds = tasks.map(t => t._id);

  return (
    <div className="flex flex-col w-80 min-h-[500px]">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
          <h3 className="font-bold text-slate-700 dark:text-slate-300">
            {column.title}
          </h3>
          <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-400">
            <Plus size={16} />
          </button>
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-400">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 bg-slate-100/50 dark:bg-slate-900/40 p-3 rounded-2xl space-y-3 transition-colors border-2 border-transparent"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onDelete={() => onDeleteTask(task._id)} 
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
            <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 text-sm">
                Drop tasks here
            </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
