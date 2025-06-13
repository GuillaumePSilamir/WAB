import React from 'react';

const Hammer = ({ hammerPosition, hammerHit }) => {
  return (
    <div
      className={`fixed pointer-events-none z-50 text-[4rem] sm:text-[5rem] transition-transform duration-150 ease-in-out
        ${hammerHit ? 'rotate-45 scale-125' : 'rotate-0 scale-100'}`}
      style={{
        left: `${hammerPosition.x}px`,
        top: `${hammerPosition.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      🔨
    </div>
  );
};

export default Hammer;
