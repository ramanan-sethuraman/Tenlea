import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({
  variant = 'dark',
  size = 'md',
  showTagline = false,
  iconOnly = false,
  clickable = true,
  to = '/about',
  className = '',
  style = {}
}) => {
  // Configured dimensions for different sizes - crisp, sleek, and perfectly proportioned
  const sizeMap = {
    sm: { height: showTagline ? '40px' : '28px', iconSize: '28px' },
    md: { height: showTagline ? '56px' : '38px', iconSize: '38px' },
    lg: { height: showTagline ? '80px' : '60px', iconSize: '60px' },
    xl: { height: showTagline ? '120px' : '90px', iconSize: '90px' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex flex-col items-start justify-center group select-none ${className}`}>
      {iconOnly ? (
        /* === ICON ONLY === */
        <img
          src="/favicon.png"
          alt="TENLEA"
          className="transition-transform duration-300 group-hover:scale-105 object-contain"
          style={{ width: currentSize.iconSize, height: currentSize.iconSize, objectFit: 'contain', ...style }}
        />
      ) : (
        /* === FULL LOGO WORDMARK ("Tenlea") === */
        <img
          src="/logo.png"
          alt="TENLEA — Monetize Your Space"
          className="h-auto transition-transform duration-300 group-hover:scale-[1.02] object-contain drop-shadow-md"
          style={{ height: currentSize.height, maxWidth: '100%', objectFit: 'contain', ...style }}
        />
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link 
        to={to} 
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
        className="inline-flex items-center" 
        aria-label="TENLEA About"
      >
        {content}
      </Link>
    );
  }

  return content;
};

