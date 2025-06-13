import React from 'react';

const ScorePopup = ({ id, points, isPositive }) => {
  return (
    <div
      key={id}
      className={`fixed z-50 pointer-events-none text-3xl font-extrabold 
        ${isPositive ? 'text-green-400' : 'text-red-400'}
        animate-[popupFloat_0.8s_ease-out_forwards]`}
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      {points > 0 ? '+' : ''}{points}
    </div>
  );
};

export default ScorePopup;
