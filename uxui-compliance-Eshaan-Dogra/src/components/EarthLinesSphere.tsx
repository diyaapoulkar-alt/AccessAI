/**
 * Earth Lines Sphere - Authentic Video Background (Drake Theme)
 * AccessAI Suite
 */

import React, { useRef } from 'react';

export const EarthLinesSphere: React.FC<{ className?: string }> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black ${className}`}>
      {/* Authentic Drake Earth Lines Sphere Live Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-45 mix-blend-screen pointer-events-none"
      >
        <source
          src="https://wpriverthemes.com/drake/wp-content/themes/drake/assets/images/video1.mp4"
          type="video/mp4"
        />
      </video>

      {/* Subtle Dark Vignette Gradient */}
      <div className="fixed inset-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none" />
    </div>
  );
};
