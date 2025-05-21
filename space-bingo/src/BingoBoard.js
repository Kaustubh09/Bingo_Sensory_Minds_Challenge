import React from 'react';
import { SPACE_ITEMS } from './constants'; // Removed WIN_SOUND import
import './BingoBoard.css';

const BingoBoard = ({ cells, winningLines, onCellClick }) => {
  const isWinningCell = (index) => winningLines.some(line => line.includes(index));

  return (
    <div className="board">
      {cells.map((isActive, index) => (
        <button
          key={index}
          className={`cell ${isActive ? 'active' : ''} 
            ${isWinningCell(index) ? 'winning' : ''} 
            ${index === 12 ? 'free' : ''}`}
          onClick={() => onCellClick(index)}
          disabled={index === 12}
        >
          {index === 12 ? (
            <div className="free-cell">
              <div>🪐</div>
              <div>FREE</div>
            </div>
          ) : (
            <div className="space-item">
              {SPACE_ITEMS[index]}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default BingoBoard;