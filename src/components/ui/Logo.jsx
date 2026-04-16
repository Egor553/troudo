import React from 'react';

const Logo = ({ className = "h-8", showText = true, textColor = "text-secondary" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Icon recreated from reference image */}
      <svg 
        viewBox="0 0 100 100" 
        className="h-full w-auto" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M20 70L45 25L70 70H20Z" 
          stroke="currentColor" 
          strokeWidth="8" 
          strokeLinejoin="round"
          className="text-secondary"
        />
        <path 
          d="M40 80L65 35L90 80H40Z" 
          stroke="currentColor" 
          strokeWidth="8" 
          strokeLinejoin="round"
          className="text-primary"
        />
        <path 
          d="M10 50L35 5L60 50H10Z" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinejoin="round"
          className="text-secondary opacity-40"
        />
      </svg>

      {showText && (
        <span className={`text-2xl font-bold tracking-[0.1em] uppercase ${textColor}`}>
          Troudo
        </span>
      )}
    </div>
  );
};

export default Logo;
