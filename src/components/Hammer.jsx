import React from 'react';

const Hammer = ({ hammerPosition, hammerHit }) => {
  return (
    <div
      className={`fixed pointer-events-none z-50 text-7xl transition-transform duration-100 ${hammerHit ? 'scale-400 rotate-45' : ''}`}
      style={{
        left: hammerPosition.x,
        top: hammerPosition.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      🔨
    </div>
  );
};

export default Hammer;
