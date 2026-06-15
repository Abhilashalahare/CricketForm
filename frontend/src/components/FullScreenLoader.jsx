import React from 'react';

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Revolving Spinner */}
        <div className="w-16 h-16 border-4 border-[#0A1F5C] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-[#0A1F5C] animate-pulse">LOADING...</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;