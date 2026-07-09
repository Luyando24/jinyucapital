import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
  return (
    <img 
      src="https://horizons-cdn.hostinger.com/b89183a0-b6a3-4e5f-9421-7ba71104641c/ce34fecd-5183-4876-867b-9d7bc1f29fe7-3MTTp.png" 
      alt="Jinyu Logo" 
      className={className} 
    />
  );
};

export default Logo;
