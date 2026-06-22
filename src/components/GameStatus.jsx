import { useGame } from '../context/GameContext';

/**
 * GameStatus Component: Displays next player turn, winner banners,
 * or draw alerts. Enhances UX by acknowledging AI's thinking states.
 */
export default function GameStatus() {
  const { winner, isDraw, xIsNext, gameMode, isAiMoving, timeLeft, timeoutWinner, playerNames } = useGame();

  const renderStatus = () => {
    if (timeoutWinner) {
      const badgeClass = timeoutWinner.toLowerCase();
      const timedOutPlayer = timeoutWinner === 'X' ? 'O' : 'X';
      const winnerName = playerNames?.[timeoutWinner] || timeoutWinner;
      const timedOutName = playerNames?.[timedOutPlayer] || timedOutPlayer;
      return (
        <>
          Winner: <span className={`status-badge ${badgeClass}`}>{winnerName}</span> (⏱️ {timedOutName} timed out) 🎉
        </>
      );
    }
    if (winner) {
      const badgeClass = winner.toLowerCase();
      const winnerName = playerNames?.[winner] || winner;
      return (
        <>
          Winner: <span className={`status-badge ${badgeClass}`}>{winnerName}</span> 🎉
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
      const cpuName = playerNames?.O || 'Computer';
      return (
        <>
          {cpuName} is <span className="status-badge o">thinking...</span> 🤖
        </>
      );
    }

    const currentPlayer = xIsNext ? 'X' : 'O';
    const badgeClass = currentPlayer.toLowerCase();
    const isWarning = timeLeft <= 5;
    const currentName = playerNames?.[currentPlayer] || currentPlayer;
    
    return (
      <>
        Next Player: <span className={`status-badge ${badgeClass}`}>{currentName}</span>
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
