import React from 'react';

const ScorePopup = ({ id, points, isPositive }) => {
  return (
    <div
      key={id}
      className={`fixed pointer-events-none text-xl font-bold z-50 animate-pulse ${isPositive ? 'text-green-400' : 'text-red-400'}`}
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'float 1s ease-out forwards'
      }}
    >
      {points > 0 ? '+' : ''}{points}
    </div>
  );
};

export default ScorePopup;
