import React, { useState } from 'react';
import { X, Sparkles, Search } from 'lucide-react';
import { fetchGroupDetails } from '../services/geminiService';
import { Group } from '../types';

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (group: Group) => void;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const details = await fetchGroupDetails(query);
      if (details) {
        const newGroup: Group = {
          id: Date.now().toString(),
          name: details.name,
          description: details.description,
          members: details.members,
          themeColor: details.themeColor,
          votes: 1, // Starts with 1 vote
          imageUrl: `https://picsum.photos/seed/${details.name.replace(/\s/g, '')}/400/300`
        };
        onAdd(newGroup);
        onClose();
        setQuery('');
      } else {
        setError("Could not find details for this group.");
      }
    } catch (err) {
      setError("AI Service unavailable. Check API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-yellow-400" />
              Add New Group
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Group Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. NewJeans, BTS, SEVENTEEN..."
                  className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  autoFocus
                />
                <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                AI will fetch the members, color theme, and description automatically.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-full bg-pink-600 hover:bg-pink-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Summoning Info...
                </>
              ) : (
                'Add to Poll'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGroupModal;
