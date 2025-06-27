
import React from 'react';

interface MagicalOverlayProps {
  showOutput: boolean;
  outputAnimation: boolean;
}

const MagicalOverlay: React.FC<MagicalOverlayProps> = ({ showOutput, outputAnimation }) => {
  if (!showOutput || !outputAnimation) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="magical-sparkle-overlay" />
    </div>
  );
};

export default MagicalOverlay;
