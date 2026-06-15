import React from 'react';
import jyccLogo from '../assets/jycc-logo.png';
import companyLogo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full min-h-[100px] md:h-24 flex items-center px-4 overflow-hidden shadow-lg bg-gradient-to-r from-[#020617] via-[#0A1F5C] to-[#1E3A8A]">
      
      {/* BACKGROUND: Slanted division only for desktop */}
      <div className="hidden md:block absolute inset-0 bg-gray-200 z-0" />
      <div 
        className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#020617] via-[#0A1F5C] to-[#1E3A8A] z-10"
        style={{ clipPath: 'polygon(0 0, 65% 0, 55% 100%, 0 100%)' }}
      />

      {/* CONTENT */}
      <div className="relative z-20 w-full flex items-center justify-between md:px-8">
        
        {/* LEFT SECTION: Logo + Text Group */}
        <div className="flex items-center gap-3 md:gap-4 flex-grow">
          <img src={jyccLogo} alt="JYCC Logo" className="h-12 w-12 md:h-14 md:w-14 object-contain" />
          
          {/* Text Container: This holds Title/Tagline on left and JYCC 2.0 on right */}
          <div className="flex items-center justify-between flex-grow text-white">
            <div className="flex flex-col">
              <h1 className="text-sm md:text-3xl font-black uppercase tracking-wide leading-tight">
                JAIN YOUTH CRICKET CUP
              </h1>
              <p className="text-blue-300 font-bold text-[10px] md:text-xl hidden md:block">JYCC 2.0</p>
              <p className="text-[9px] md:text-xs font-bold tracking-[0.2em] uppercase text-yellow-400 mt-1">
                BIGGER • BOLDER • BETTER
              </p>
            </div>
            
            {/* JYCC 2.0 aligned to the right within the text container */}
            <p className="text-blue-300 font-bold text-sm md:text-2xl ml-4 md:hidden">JYCC 2.0</p>
          </div>
        </div>

        {/* RIGHT SECTION: Company Logo (Hidden on Mobile) */}
        <div className="hidden md:flex items-center ml-8">
          <img src={companyLogo} alt="Company Logo" className="h-12 w-auto object-contain" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;