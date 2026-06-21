import React from 'react';
import { SearchX } from 'lucide-react';
import { motion } from 'motion/react';

interface NoResultsProps {
  title?: string;
  message?: string;
  onClearFilters?: () => void;
}

export default function NoResults({ 
  title = "No results found", 
  message = "We couldn't find any vouchers matching your search or filter criteria.",
  onClearFilters 
}: NoResultsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
        <SearchX className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6">{message}</p>
      {onClearFilters && (
        <button 
          onClick={onClearFilters}
          className="px-6 py-2 bg-teal-50 text-teal-700 font-medium rounded-lg hover:bg-teal-100 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </motion.div>
  );
}
