import { useGame } from '../context/GameContext';
import { useEffect, useRef } from 'react';

/**
 * MoveHistory Component: Renders a scrollable panel displaying the history
 * of moves made during the game. Clicking any move item navigates the board
 * state to that point in time.
 */
export default function MoveHistory() {
  const { history, currentStep, jumpToStep } = useGame();
  const listEndRef = useRef(null);

  // Auto-scroll to show the newest move when it is added
  useEffect(() => {
    if (listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history.length]);

  /**
   * Translates the difference between consecutive steps into human-readable details.
   */
  const renderMoveDescription = (stepIndex) => {
    if (stepIndex === 0) {
      return <span className="move-desc start-label">🚀 Game Start</span>;
    }
    
    const prevBoard = history[stepIndex - 1];
    const currBoard = history[stepIndex];
    let diffIndex = -1;
    
    for (let j = 0; j < 9; j++) {
      if (prevBoard[j] !== currBoard[j]) {
        diffIndex = j;
        break;
      }
    }
    
    if (diffIndex === -1) {
      return <span className="move-desc">Move #{stepIndex}</span>;
    }
    
    const player = currBoard[diffIndex];
    const row = Math.floor(diffIndex / 3) + 1;
    const col = (diffIndex % 3) + 1;
    
    return (
      <span className="move-desc">
        <span className={`move-badge ${player.toLowerCase()}`}>{player}</span>
        <span> placed at </span>
        <strong className="move-coord">R{row}, C{col}</strong>
      </span>
    );
  };

  return (
    <section className="history-panel" id="move-history" aria-label="Move history list">
      <h2 className="history-title">📜 Move History</h2>
      <div className="history-list-container">
        <ol className="history-list">
          {history.map((_, stepIndex) => {
            const isActive = stepIndex === currentStep;
            return (
              <li key={stepIndex} className="history-item">
                <button
                  type="button"
                  className={`history-btn ${isActive ? 'active' : ''}`}
                  onClick={() => jumpToStep(stepIndex)}
                  aria-label={`Jump back to move ${stepIndex}`}
                >
                  <span className="step-num">#{stepIndex}</span>
                  {renderMoveDescription(stepIndex)}
                </button>
              </li>
            );
          })}
          <div ref={listEndRef} />
        </ol>
      </div>
    </section>
  );
}
