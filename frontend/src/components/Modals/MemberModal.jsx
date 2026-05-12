import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, Loader2, Check } from 'lucide-react';
import API from '../../api/axios';

const MemberModal = ({ isOpen, onClose, project, onMemberAdded }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    if (isOpen && searchTerm.length > 2) {
      searchUsers();
    }
  }, [searchTerm]);

  const searchUsers = async () => {
    try {
      const { data } = await API.get(`/users?search=${searchTerm}`);
      // Filter out existing members
      const filtered = data.filter(u => !project.members.some(m => m._id === u._id));
      setUsers(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (userId) => {
    setAddingId(userId);
    try {
      const { data } = await API.put(`/projects/${project._id}/members`, { userId });
      onMemberAdded(data.members);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error(err);
      alert('Failed to add member');
    } finally {
      setAddingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Add Team Members</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {users.length === 0 && searchTerm.length > 2 && (
              <p className="text-center text-slate-500 py-4">No users found.</p>
            )}
            {users.length === 0 && searchTerm.length <= 2 && (
              <p className="text-center text-slate-500 py-4 text-sm italic">Type at least 3 characters to search...</p>
            )}
            
            {users.map(user => (
              <div key={user._id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-sm font-bold">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleAddMember(user._id)}
                  disabled={addingId === user._id}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {addingId === user._id ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={onClose}
            className="w-full btn btn-secondary py-3"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;
