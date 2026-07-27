import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({
  variant = 'dark',
  size = 'md',
  showTagline = false,
  iconOnly = false,
  clickable = true,
  className = ''
}) => {
  // Configured dimensions for different sizes
  const sizeMap = {
    sm: { height: showTagline ? '52px' : '38px', iconSize: '38px' },
    md: { height: showTagline ? '76px' : '56px', iconSize: '56px' },
    lg: { height: showTagline ? '112px' : '82px', iconSize: '82px' },
    xl: { height: showTagline ? '160px' : '120px', iconSize: '120px' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex flex-col items-center justify-center group select-none ${className}`}>
      {iconOnly ? (
        /* === ICON ONLY (Winged T Emblem) === */
        <img
          src="/favicon.svg"
          alt="TENLEA"
          className="transition-transform duration-300 group-hover:scale-105 rounded-xl"
          style={{ width: currentSize.iconSize, height: currentSize.iconSize, objectFit: 'contain' }}
        />
      ) : (
        /* === FULL LOGO WORDMARK ("Tenlea" + "Monetize Your Space") === */
        <img
          src="/logo.svg"
          alt="TENLEA — Monetize Your Space"
          className="h-auto transition-transform duration-300 group-hover:scale-[1.015] object-contain"
          style={{ height: currentSize.height, maxWidth: '100%' }}
        />
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="inline-flex items-center" aria-label="TENLEA Home">
        {content}
      </Link>
    );
  }

  return content;
};
