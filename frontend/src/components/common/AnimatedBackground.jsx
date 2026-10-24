import React, { useState, useEffect, useRef } from 'react';

export const AnimatedBackground = ({
  variant = 'default',
  showVideo = false,
  imageSrc = null,
  showOrbs = true,
  showGrid = false,
  showVehicles = false,
  videoSrc = '/bg-video.mp4',
  posterSrc = '/hero-poster.jpg',
  playbackRate = 1,
  lazy = false,
  grayscale = false,
  className = '',
  children,
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(!lazy);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Lazy loading: off-screen videos only attach when entering viewport
  useEffect(() => {
    if (!showVideo || !lazy || shouldLoadVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '300px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [showVideo, lazy, shouldLoadVideo]);

  // Video playback speed and autoplay reliability
  useEffect(() => {
    if (!showVideo || !shouldLoadVideo) return;
    const video = videoRef.current;
    if (!video) return;

    if (playbackRate && playbackRate !== 1) {
      video.playbackRate = playbackRate;
    }

    const tryPlay = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Safely catch browser autoplay hesitations
        });
      }
    };

    tryPlay();
  }, [showVideo, shouldLoadVideo, playbackRate]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full max-w-full ${className}`}
    >
      {/* 1. Hardware-Accelerated Video Background with Instant Poster & Smooth Fade-in */}
      {showVideo && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden w-full h-full">
          {/* Instant Poster Backdrop: Eliminates black screen void on refresh */}
          {posterSrc && (
            <img
              src={posterSrc}
              alt=""
              loading="eager"
              fetchPriority="high"
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none transition-opacity duration-1000 ${
                grayscale ? 'grayscale contrast-125 brightness-90' : ''
              } ${videoLoaded ? 'opacity-20' : 'opacity-65'}`}
            />
          )}

          {/* HTML5 Streamed Video */}
          {shouldLoadVideo && (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={posterSrc}
              disablePictureInPicture
              disableRemotePlayback
              onLoadedData={() => {
                setVideoLoaded(true);
                if (videoRef.current && playbackRate && playbackRate !== 1) {
                  videoRef.current.playbackRate = playbackRate;
                }
              }}
              onCanPlay={() => {
                setVideoLoaded(true);
              }}
              style={{ transform: 'translateZ(0)' }}
              className={`w-full h-full object-cover scale-105 will-change-transform transition-opacity duration-1000 ease-in-out ${
                grayscale ? 'grayscale contrast-125 brightness-90' : ''
              } ${videoLoaded ? 'opacity-50' : 'opacity-0'}`}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}

          {/* Dark Glass Vignette Overlay for High Contrast Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/85 via-zinc-950/60 to-zinc-950/90" />
        </div>
      )}

      {/* Static Photo Backdrop (Clean, Instant Load, No Video Delay) */}
      {imageSrc && !showVideo && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden w-full h-full">
          <img
            src={imageSrc}
            alt=""
            loading="eager"
            fetchPriority="high"
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none ${
              grayscale ? 'grayscale contrast-125 brightness-90' : ''
            } opacity-50`}
          />
          {/* Dark Glass Vignette Overlay for High Contrast Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/85 via-zinc-950/50 to-zinc-950/90" />
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
      <div className="relative z-10 w-full max-w-full flex flex-col items-center justify-center min-h-full">
        {children}
      </div>
    </div>
  );
};
