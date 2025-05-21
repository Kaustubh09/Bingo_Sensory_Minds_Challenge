import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import BingoBoard from './BingoBoard';
import Confetti from 'react-confetti';
import './App.css';

const socket = io();

function App() {
  const [cells, setCells] = useState(Array(25).fill(false));
  const [showConfetti, setShowConfetti] = useState(false);
  const [winningLines, setWinningLines] = useState([]);

  useEffect(() => {
    socket.on('game_state', (newGameState) => {
      setCells(newGameState);
      checkWinningLines(newGameState);
    });

    return () => socket.off('game_state');
  }, []);

  const checkWinningLines = (currentCells) => {
    const lines = [];
    // Generate all possible winning lines
    for (let i = 0; i < 5; i++) {
      lines.push(Array.from({ length: 5 }, (_, j) => i * 5 + j)); // Rows
      lines.push(Array.from({ length: 5 }, (_, j) => i + j * 5)); // Columns
    }
    lines.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]); // Diagonals

    const winning = lines.filter(line => 
      line.every(index => index === 12 ? true : currentCells[index])
    );

    setWinningLines(winning);
    setShowConfetti(winning.length > 0);
  };

  return (
    <div className="App">
      <h1>Space Bingo 🚀</h1>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      <BingoBoard 
        cells={cells} 
        winningLines={winningLines}
        onCellClick={(index) => index !== 12 && socket.emit('toggle_cell', index)}
      />
      {showConfetti && <div className="win-message"><h2>BINGO! 🎉</h2></div>}
    </div>
  );
}

export default App;