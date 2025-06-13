import React from 'react';

const GameBoard = ({ targets, onHit }) => {
  return (
    <div className="grid grid-cols-4 gap-6 max-w-screen-md mx-auto">
      {targets.map((target, index) => (
        <div
          key={index}
          className="w-28 h-28 bg-gray-800 rounded-full relative shadow-inner border-4 border-gray-600 overflow-hidden"
        >
          {target && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl cursor-pointer transition-transform duration-300 hover:scale-110"
              onClick={() => onHit(index)}
            >
              {target.emoji}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
