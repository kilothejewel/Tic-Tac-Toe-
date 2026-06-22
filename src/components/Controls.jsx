import { useGame } from '../context/GameContext';

/**
 * Controls Component: UI panel containing game mode selectors,
 * AI difficulty toggles, and buttons for reset/undo capabilities.
 */
export default function Controls() {
  const {
    gameMode,
    setGameMode,
    aiDifficulty,
    setDifficulty,
    resetGame,
    resetScore,
    undoMove,
    history,
    winner,
    isDraw,
    isAiMoving,
    goToSetup,
  } = useGame();

  // Undo button is disabled if there are no moves to revert,
  // if the game is already over (prevents outcome manipulation),
  // or if the computer is currently making a move.
  const isUndoDisabled = history.length <= 1 || winner || isDraw || isAiMoving;

  return (
    <section className="controls-panel" id="game-controls" aria-label="Game controls">
      {/* Game Mode Selector */}
      <div className="toggle-group" id="mode-selection">
        <button
          type="button"
          className={`toggle-btn ${gameMode === 'pvp' ? 'active' : ''}`}
          onClick={() => setGameMode('pvp')}
          disabled={isAiMoving}
        >
          👥 1v1 Local
        </button>
        <button
          type="button"
          className={`toggle-btn ${gameMode === 'ai' ? 'active' : ''}`}
          onClick={() => setGameMode('ai')}
          disabled={isAiMoving}
        >
          🤖 vs Computer
        </button>
      </div>

      {/* AI Difficulty Selector - shown conditionally */}
      {gameMode === 'ai' && (
        <div className="toggle-group" id="difficulty-selection">
          <button
            type="button"
            className={`toggle-btn ${aiDifficulty === 'easy' ? 'active' : ''}`}
            onClick={() => setDifficulty('easy')}
            disabled={isAiMoving}
          >
            🌱 Easy CPU
          </button>
          <button
            type="button"
            className={`toggle-btn ${aiDifficulty === 'hard' ? 'active' : ''}`}
            onClick={() => setDifficulty('hard')}
            disabled={isAiMoving}
          >
            🧠 Minimax CPU
          </button>
        </div>
      )}

      {/* Primary Actions: Restart & Undo */}
      <div className="control-row">
        <button
          type="button"
          className="btn btn-primary"
          id="btn-restart"
          onClick={resetGame}
          disabled={isAiMoving}
        >
          🔄 Restart Board
        </button>
        
        <button
          type="button"
          className="btn"
          id="btn-undo"
          onClick={undoMove}
          disabled={isUndoDisabled}
        >
          ⏪ Undo Move
        </button>
      </div>

      {/* Secondary Actions: Reset Scores & Edit Names */}
      <div className="control-row">
        <button
          type="button"
          className="btn"
          id="btn-reset-scores"
          onClick={resetScore}
          disabled={isAiMoving}
        >
          🔢 Reset Scores
        </button>
        
        <button
          type="button"
          className="btn"
          id="btn-edit-names"
          onClick={goToSetup}
          disabled={isAiMoving}
        >
          ✏️ Edit Names
        </button>
      </div>
    </section>
  );
}
