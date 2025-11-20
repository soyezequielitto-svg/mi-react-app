import React, { useState } from 'react';
import { Group } from '../types';
import { Heart, Music, Users } from 'lucide-react';
import { generateFanCheer } from '../services/geminiService';

interface GroupCardProps {
  group: Group;
  onVote: (id: string) => void;
  isLeading: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onVote, isLeading }) => {
  const [cheer, setCheer] = useState<string | null>(null);
  const [isGeneratingCheer, setIsGeneratingCheer] = useState(false);

  const handleCheer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cheer) return; // Already cheered

    setIsGeneratingCheer(true);
    const msg = await generateFanCheer(group.name);
    setCheer(msg);
    setIsGeneratingCheer(false);
  };

  return (
    <div 
      className="relative group overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 hover:border-pink-500 transition-all duration-300 shadow-lg hover:shadow-pink-500/20 flex flex-col"
      style={{ borderColor: isLeading ? '#fbbf24' : undefined }} // Gold border for leader
    >
      {isLeading && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full z-10 shadow-md animate-bounce">
          👑 Leader
        </div>
      )}
      
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
        <img 
          src={group.imageUrl} 
          alt={group.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
          <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-lg">
            {group.name}
          </h3>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300 mt-1">
             <Users size={14} />
             <span>{group.members.length} Members</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {group.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {group.members.slice(0, 3).map((m, i) => (
            <span key={i} className="text-[10px] bg-slate-700 px-2 py-1 rounded-md text-slate-300">
              {m}
            </span>
          ))}
          {group.members.length > 3 && (
             <span className="text-[10px] bg-slate-700 px-2 py-1 rounded-md text-slate-300">
               +{group.members.length - 3}
             </span>
          )}
        </div>

        {cheer && (
          <div className="mb-4 p-3 bg-slate-700/50 rounded-lg text-sm text-pink-300 italic border-l-2 border-pink-500 animate-fade-in">
            "{cheer}"
          </div>
        )}

        <div className="mt-auto flex gap-3">
          <button
            onClick={() => onVote(group.id)}
            className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Heart size={18} fill="currentColor" />
            Vote
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs ml-1">
              {group.votes}
            </span>
          </button>
          
          <button 
            onClick={handleCheer}
            disabled={isGeneratingCheer}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-200 transition-colors"
            title="Generate AI Cheer"
          >
             {isGeneratingCheer ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Music size={18} />}
          </button>
        </div>
      </div>
      
      {/* Dynamic bottom border based on group color */}
      <div 
        className="h-1 w-full" 
        style={{ backgroundColor: group.themeColor }}
      />
    </div>
  );
};

export default GroupCard;
