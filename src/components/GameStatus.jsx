import { useGame } from '../context/GameContext';

/**
 * GameStatus Component: Displays next player turn, winner banners,
 * or draw alerts. Enhances UX by acknowledging AI's thinking states.
 */
export default function GameStatus() {
  const { winner, isDraw, xIsNext, gameMode, isAiMoving, timeLeft, timeoutWinner } = useGame();

  const renderStatus = () => {
    if (timeoutWinner) {
      const badgeClass = timeoutWinner.toLowerCase();
      const timedOutPlayer = timeoutWinner === 'X' ? 'O' : 'X';
      return (
        <>
          Winner: <span className={`status-badge ${badgeClass}`}>{timeoutWinner}</span> (⏱️ {timedOutPlayer} timed out) 🎉
        </>
      );
    }
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
    const isWarning = timeLeft <= 5;
    
    return (
      <>
        Next Player: <span className={`status-badge ${badgeClass}`}>{currentPlayer}</span>
        <span className={`timer-badge ${isWarning ? 'warning' : ''}`} id="move-timer">
          ⏱️ {timeLeft}s
        </span>
      </>
    );
  };

  return (
    <div className="status-banner" id="game-status">
      {renderStatus()}
    </div>
  );
}
