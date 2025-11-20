import React, { useState, useMemo } from 'react';
import { Group } from './types';
import GroupCard from './components/GroupCard.tsx';
import AddGroupModal from './components/AddGroupModal.tsx';
import { Plus, BarChart2, Trophy, Mic2, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Initial seed data
const INITIAL_GROUPS: Group[] = [
  {
    id: '1',
    name: 'BTS',
    description: 'The biggest boy band in the world, known for their self-produced music and global ARMY.',
    members: ['RM', 'Jin', 'Suga', 'J-Hope', 'Jimin', 'V', 'Jungkook'],
    themeColor: '#B05EC6', // Purple
    votes: 0,
    imageUrl: 'https://picsum.photos/seed/bts/400/300'
  },
  {
    id: '2',
    name: 'BLACKPINK',
    description: 'Global superstars known for their fierce charisma and chart-topping hits.',
    members: ['Jisoo', 'Jennie', 'Rosé', 'Lisa'],
    themeColor: '#EC4899', // Pink
    votes: 0,
    imageUrl: 'https://picsum.photos/seed/blackpink/400/300'
  },
  {
    id: '3',
    name: 'Stray Kids',
    description: 'Self-producing idols leading the 4th generation with powerful performances.',
    members: ['Bang Chan', 'Lee Know', 'Changbin', 'Hyunjin', 'Han', 'Felix', 'Seungmin', 'I.N'],
    themeColor: '#EF4444', // Red
    votes: 0,
    imageUrl: 'https://picsum.photos/seed/straykids/400/300'
  },
  {
    id: '4',
    name: 'NewJeans',
    description: 'Fresh, retro-inspired girl group taking over the charts with Y2K vibes.',
    members: ['Minji', 'Hanni', 'Danielle', 'Haerin', 'Hyein'],
    themeColor: '#3B82F6', // Blue
    votes: 0,
    imageUrl: 'https://picsum.photos/seed/newjeans/400/300'
  }
];

const App: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'vote' | 'results'>('vote');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle voting logic
  const handleVote = (id: string) => {
    setGroups(prev => prev.map(g => 
      g.id === id ? { ...g, votes: g.votes + 1 } : g
    ));
  };

  // Handle adding new group
  const handleAddGroup = (newGroup: Group) => {
    setGroups(prev => [...prev, newGroup]);
    setView('vote'); // Switch back to vote view to see the new addition
  };

  // Derived state for sorting and filtering
  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => b.votes - a.votes);
  }, [groups]);

  const filteredGroups = useMemo(() => {
    return sortedGroups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [sortedGroups, searchTerm]);

  const leadingGroupId = sortedGroups[0]?.id;

  // Total votes for stats
  const totalVotes = groups.reduce((sum, g) => sum + g.votes, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
               <Mic2 className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
              K-Pop Stan Polls
            </h1>
          </div>

          <div className="flex items-center gap-4">
             {/* View Toggles */}
             <div className="flex bg-slate-800 p-1 rounded-xl">
                <button 
                  onClick={() => setView('vote')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'vote' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Vote
                </button>
                <button 
                  onClick={() => setView('results')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'results' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Results
                </button>
             </div>

             <button
               onClick={() => setIsModalOpen(true)}
               className="bg-pink-600 hover:bg-pink-500 text-white p-2 rounded-full transition-transform hover:scale-105 shadow-lg shadow-pink-600/20"
               title="Add Group"
             >
               <Plus size={20} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === 'vote' && (
          <>
             {/* Hero / Stats Section */}
             <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex items-center gap-4">
                   <div className="p-3 bg-purple-500/20 rounded-full text-purple-400">
                      <Trophy size={24} />
                   </div>
                   <div>
                      <p className="text-slate-400 text-sm">Current Leader</p>
                      <p className="text-xl font-bold text-white">{sortedGroups[0]?.name || '-'}</p>
                   </div>
                </div>
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex items-center gap-4">
                   <div className="p-3 bg-pink-500/20 rounded-full text-pink-400">
                      <BarChart2 size={24} />
                   </div>
                   <div>
                      <p className="text-slate-400 text-sm">Total Votes</p>
                      <p className="text-xl font-bold text-white">{totalVotes.toLocaleString()}</p>
                   </div>
                </div>
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex items-center gap-4 sm:col-span-1">
                   <div className="w-full relative">
                      <input 
                        type="text" 
                        placeholder="Search groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                      <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                   </div>
                </div>
             </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGroups.map(group => (
                <GroupCard 
                  key={group.id} 
                  group={group} 
                  onVote={handleVote} 
                  isLeading={group.id === leadingGroupId}
                />
              ))}
            </div>

            {filteredGroups.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-500 mb-4">No groups found.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-pink-500 font-medium hover:underline"
                >
                  Add one now?
                </button>
              </div>
            )}
          </>
        )}

        {view === 'results' && (
          <div className="bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <BarChart2 className="text-purple-400" />
              Live Results
            </h2>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedGroups} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#94a3b8" 
                    width={100}
                    tick={{ fill: '#cbd5e1', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{fill: 'transparent'}}
                  />
                  <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={32}>
                    {sortedGroups.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.themeColor || '#8884d8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>

      <AddGroupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddGroup} 
      />
    </div>
  );
};

export default App;
