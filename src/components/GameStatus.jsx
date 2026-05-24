import React from 'react';
import { useGame } from '../context/GameContext';

/**
 * GameStatus Component: Displays next player turn, winner banners,
 * or draw alerts. Enhances UX by acknowledging AI's thinking states.
 */
export default function GameStatus() {
  const { winner, isDraw, xIsNext, gameMode, isAiMoving } = useGame();

  const renderStatus = () => {
    if (winner) {
      const badgeClass = winner.toLowerCase();
      return (
        <>
          Winner: <span className={`status-badge ${badgeClass}`}>{winner}</span> 🎉
        </>
      );
    }
    if (isDraw) {
      return (
        <>
          Outcome: <span className="status-badge draw">Draw!</span> 🤝
        </>
      );
    }

    // AI thinking state check
    if (gameMode === 'ai' && !xIsNext && isAiMoving) {
      return (
        <>
          Computer is <span className="status-badge o">thinking...</span> 🤖
        </>
      );
    }

    const currentPlayer = xIsNext ? 'X' : 'O';
    const badgeClass = currentPlayer.toLowerCase();
    
    return (
      <>
        Next Player: <span className={`status-badge ${badgeClass}`}>{currentPlayer}</span>
      </>
    );
  };

  return (
    <div className="status-banner" id="game-status">
      {renderStatus()}
    </div>
  );
}
