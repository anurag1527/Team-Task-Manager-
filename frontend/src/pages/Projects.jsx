import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { Plus, Briefcase, Users, Calendar, MoreVertical, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  // Form State
  const [newProject, setNewProject] = useState({
    projectName: '',
    description: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/projects', newProject);
      setProjects([...projects, data]);
      setShowModal(false);
      setNewProject({ projectName: '', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const ProjectCard = ({ project }) => (
    <div className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center">
            <Briefcase size={24} />
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1">
            <MoreVertical size={20} />
          </button>
        </div>
        
        <Link to={`/projects/${project._id}`}>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
            {project.projectName}
          </h3>
        </Link>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 line-clamp-2">
          {project.description}
        </p>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.members?.slice(0, 3).map((member, i) => (
              <img 
                key={i}
                src={member.avatar} 
                className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900" 
                alt={member.name} 
              />
            ))}
            {project.members?.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold">
                +{project.members.length - 3}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
            <Calendar size={14} />
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track all your team projects.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <Plus size={18} />
            New Project
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all text-sm font-medium">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card h-64 animate-pulse bg-slate-100 dark:bg-slate-800"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
          {projects.length === 0 && (
             <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Briefcase size={32} />
                </div>
                <h3 className="text-xl font-bold">No projects found</h3>
                <p className="text-slate-500 mt-2">Get started by creating your first project.</p>
             </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6">Create New Project</h3>
              <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project Name</label>
                  <input 
                    type="text" 
                    value={newProject.projectName}
                    onChange={e => setNewProject({...newProject, projectName: e.target.value})}
                    className="input-field" 
                    placeholder="e.g. Website Redesign" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                  <textarea 
                    value={newProject.description}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                    className="input-field h-32 resize-none" 
                    placeholder="Briefly describe the project goals..."
                    required
                  ></textarea>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn btn-primary">
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
