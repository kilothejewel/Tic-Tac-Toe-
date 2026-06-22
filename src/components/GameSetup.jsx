import { useState } from 'react';
import { useGame } from '../context/GameContext';

/**
 * GameSetup Component: A beautiful pre-game lobby where players
 * configure the game mode, difficulty, and customize their names.
 */
export default function GameSetup() {
  const {
    gameMode,
    setGameMode,
    aiDifficulty,
    setDifficulty,
    startGame,
    playerNames
  } = useGame();

  // Local state initialized with current context state or smart defaults
  const [playerXName, setPlayerXName] = useState(playerNames?.X || 'Player X');
  const [playerOName, setPlayerOName] = useState(() => {
    // If the opponent name is 'CPU', fallback to 'Player O' for PvP editing
    return playerNames?.O === 'CPU' ? 'Player O' : playerNames?.O || 'Player O';
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Fallbacks for empty inputs
    const finalX = playerXName.trim() || 'Player X';
    const finalO = gameMode === 'ai' ? 'CPU' : playerOName.trim() || 'Player O';

    startGame({
      X: finalX,
      O: finalO,
    });
  };

  return (
    <section className="setup-container" id="game-setup-panel" aria-label="Game configuration lobby">
      <h2 className="setup-title">⚔️ Game Setup</h2>
      <p className="setup-desc">Configure your match settings and enter player names.</p>

      <form onSubmit={handleSubmit} className="setup-form">
        {/* Game Mode Picker */}
        <div className="setup-group">
          <label className="setup-label">Select Game Mode</label>
          <div className="toggle-group" id="setup-mode-selection">
            <button
              type="button"
              className={`toggle-btn ${gameMode === 'pvp' ? 'active' : ''}`}
              onClick={() => setGameMode('pvp')}
            >
              👥 1v1 Local
            </button>
            <button
              type="button"
              className={`toggle-btn ${gameMode === 'ai' ? 'active' : ''}`}
              onClick={() => setGameMode('ai')}
            >
              🤖 vs Computer
            </button>
          </div>
        </div>

        {/* AI Difficulty Selector - shown conditionally */}
        {gameMode === 'ai' && (
          <div className="setup-group">
            <label className="setup-label">CPU Difficulty</label>
            <div className="toggle-group" id="setup-difficulty-selection">
              <button
                type="button"
                className={`toggle-btn ${aiDifficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setDifficulty('easy')}
              >
                🌱 Easy CPU
              </button>
              <button
                type="button"
                className={`toggle-btn ${aiDifficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setDifficulty('hard')}
              >
                🧠 Minimax CPU
              </button>
            </div>
          </div>
        )}

        {/* Player Name Fields */}
        <div className="names-container">
          <div className="setup-group flex-1">
            <label htmlFor="playerX-input" className="setup-label label-x">
              Player X Name
            </label>
            <input
              id="playerX-input"
              type="text"
              className="setup-input focus-x"
              value={playerXName}
              onChange={(e) => setPlayerXName(e.target.value)}
              placeholder="Enter name for Player X"
              maxLength={15}
              required
            />
          </div>

          {gameMode === 'pvp' ? (
            <div className="setup-group flex-1">
              <label htmlFor="playerO-input" className="setup-label label-o">
                Player O Name
              </label>
              <input
                id="playerO-input"
                type="text"
                className="setup-input focus-o"
                value={playerOName}
                onChange={(e) => setPlayerOName(e.target.value)}
                placeholder="Enter name for Player O"
                maxLength={15}
                required
              />
            </div>
          ) : (
            <div className="setup-group flex-1">
              <label className="setup-label label-o disabled-label">
                Opponent (O)
              </label>
              <div className="setup-input disabled-input">
                🤖 Computer (CPU)
              </div>
            </div>
          )}
        </div>

        {/* Start Game Action Button */}
        <button type="submit" className="btn btn-primary start-match-btn" id="btn-start-match">
          Let's Play! ⚔️
        </button>
      </form>
    </section>
  );
}
