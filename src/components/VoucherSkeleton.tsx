import React from 'react';

export default function VoucherSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      <div className="h-32 bg-gray-200 w-full relative">
        <div className="absolute top-2 right-2 w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-4"></div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-100 rounded w-1/4 text-right"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
}
