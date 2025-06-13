import React from 'react';

const GameBoard = ({ targets, onHit }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-5 sm:gap-6 px-4 sm:px-0 max-w-4xl mx-auto">
      {targets.map((target, index) => (
        <div
          key={index}
          className="w-24 h-24 sm:w-28 sm:h-28 bg-[#1f1f1f] rounded-full relative shadow-inner border-4 border-[#555] overflow-hidden"
        >
          {target && (
            <div
              onClick={() => onHit(index)}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full text-5xl sm:text-6xl cursor-pointer transition-all duration-300 hover:scale-125"
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
