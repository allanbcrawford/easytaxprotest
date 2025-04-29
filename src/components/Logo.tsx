
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark' }) => {
  return (
    <Link to="/" className="flex items-center">
      <div className="text-2xl font-bold">
        <span className={variant === 'light' ? 'text-white' : 'text-primary'}>
          Easy
        </span>
        <span className="text-secondary">Tax</span>
        <span className={variant === 'light' ? 'text-white' : 'text-primary'}>
          Protest
        </span>
      </div>
    </Link>
  );
};

export default Logo;
