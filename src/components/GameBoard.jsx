import React from 'react';

const GameBoard = ({ targets, onHit }) => {
  return (
    <div className="flex justify-center items-center min-h-[50vh] px-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-5 sm:gap-6 max-w-4xl">
          {targets.map((target, index) => (
            <div
              key={index}
              className="w-24 h-24 sm:w-28 sm:h-28 bg-[#1f1f1f] rounded-full relative shadow-inner border-4 border-[#555] overflow-hidden"
            >
              {target && (
                <div
                  onClick={() => onHit(index)}
                  className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl cursor-pointer transition-all duration-300 hover:scale-125"
                >
                  {target.emoji}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    
  );
};

export default GameBoard;
