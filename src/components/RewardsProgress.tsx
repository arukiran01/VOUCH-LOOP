import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Shield, Award } from 'lucide-react';

interface RewardsProgressProps {
  transactionCount: number;
}

export default function RewardsProgress({ transactionCount }: RewardsProgressProps) {
  const levels = [
    { name: 'Bronze', limit: 0, icon: <Shield className="w-6 h-6 text-orange-400" />, color: 'bg-orange-100', text: 'text-orange-700' },
    { name: 'Silver', limit: 5, icon: <Star className="w-6 h-6 text-gray-400" />, color: 'bg-gray-100', text: 'text-gray-700' },
    { name: 'Gold', limit: 15, icon: <Award className="w-6 h-6 text-yellow-500" />, color: 'bg-yellow-100', text: 'text-yellow-700' },
    { name: 'Platinum', limit: 50, icon: <Trophy className="w-6 h-6 text-indigo-500" />, color: 'bg-indigo-100', text: 'text-indigo-700' }
  ];

  let currentLevelIndex = 0;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (transactionCount >= levels[i].limit) {
      currentLevelIndex = i;
      break;
    }
  }

  const currentLevel = levels[currentLevelIndex];
  const nextLevel = currentLevelIndex < levels.length - 1 ? levels[currentLevelIndex + 1] : null;

  const getProgress = () => {
    if (!nextLevel) return 100;
    const range = nextLevel.limit - currentLevel.limit;
    const progress = transactionCount - currentLevel.limit;
    return Math.min(100, Math.max(0, (progress / range) * 100));
  };

  const remaining = nextLevel ? nextLevel.limit - transactionCount : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${currentLevel.color}`}>
               {currentLevel.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Your Current Tier</p>
              <h3 className={`text-2xl font-bold ${currentLevel.text}`}>{currentLevel.name} Status</h3>
            </div>
          </div>
          {nextLevel && (
            <div className="mt-4 sm:mt-0 text-left sm:text-right">
               <p className="text-sm font-medium text-gray-800">
                 <span className="font-bold text-teal-600">{remaining}</span> more transactions
               </p>
               <p className="text-xs text-gray-500">to unlock <b>{nextLevel.name}</b> benefits</p>
            </div>
          )}
        </div>

        <div className="relative pt-2">
          <div className="flex justify-between mb-2 absolute w-full top-0">
             {levels.map((lvl, idx) => (
                <div key={lvl.name} className={`flex flex-col items-center absolute -mt-1`} style={{ left: `${idx === 0 ? 0 : idx === levels.length -1 ? 100 : (lvl.limit / 50) * 100}%`, transform: 'translateX(-50%)' }}>
                  <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${transactionCount >= lvl.limit ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
                  <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase hidden sm:block">{lvl.name}</span>
                </div>
             ))}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-4 relative overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${getProgress()}%` }}
               transition={{ duration: 1, delay: 0.2 }}
               className="bg-teal-500 h-2 rounded-full relative z-0"
             />
          </div>
        </div>
      </div>
    </div>
  );
}
