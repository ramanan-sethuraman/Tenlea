import React from 'react';

export const AnimatedBackground = ({
  variant = 'default',
  showVideo = false,
  showOrbs = true,
  showGrid = false,
  showVehicles = false,
  videoSrc = '/bg-video.mp4',
  grayscale = false,
  className = '',
  children,
}) => {
  return (
    <div className={`relative overflow-hidden w-full max-w-full ${className}`}>
      {/* 1. Hardware-Accelerated Smooth Video Background */}
      {showVideo && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{ transform: 'translateZ(0)' }}
            className={`w-full h-full object-cover opacity-45 scale-105 will-change-transform ${
              grayscale ? 'grayscale contrast-125 brightness-90' : ''
            }`}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          {/* Dark Glass Vignette Overlay for High Contrast Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/85 via-zinc-950/60 to-zinc-950/90" />
        </div>
      )}

      {/* 2. Ambient Glowing Lights */}
      {showOrbs && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[650px] h-72 sm:h-[650px] max-w-full bg-gradient-to-tr from-slate-400/10 via-slate-100/15 to-transparent rounded-full blur-[140px] pointer-events-none animate-ambient-pulse" />
          <div className="absolute top-1/3 left-1/4 w-60 sm:w-[400px] h-60 sm:h-[400px] max-w-full bg-zinc-400/8 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-64 sm:w-[450px] h-64 sm:h-[450px] max-w-full bg-slate-300/8 rounded-full blur-[140px] pointer-events-none" />
        </div>
      )}

      {/* Top & Bottom Vignette Transitions for Smooth Edge Integration */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-0" />

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-full flex flex-col items-center justify-center min-h-full">{children}</div>
    </div>
  );
};
