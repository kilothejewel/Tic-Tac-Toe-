import { GameProvider, useGame } from './context/GameContext';
import GameStatus from './components/GameStatus';
import Scoreboard from './components/Scoreboard';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import MoveHistory from './components/MoveHistory';
import GameSetup from './components/GameSetup';

/**
 * GameContent Component: Consumes context to conditionally switch
 * between player setup screen and the active game panel.
 */
function GameContent() {
  const { gameStarted } = useGame();

  return (
    <div className={`game-panel ${!gameStarted ? 'setup-mode' : ''}`} id="game-panel">
      {!gameStarted ? (
        <GameSetup />
      ) : (
        <>
          <div className="game-main">
            <GameStatus />
            <Scoreboard />
            <GameBoard />
            <Controls />
          </div>
          <MoveHistory />
        </>
      )}
    </div>
  );
}

/**
 * App Root Component: Wraps the core game panel in the GameProvider
 * context to establish clean state flow to nested components.
 */
function App() {
  return (
    <GameProvider>
      {/* App Branding Header */}
      <header className="app-header">
        <h1 className="app-title" id="main-title">Tic-Tac-Toe</h1>
        <p className="app-subtitle">React Internship Engine</p>
      </header>

      {/* Main Glassmorphic Game Interface */}
      <GameContent />

      {/* App Footer */}
      <footer className="app-footer" id="app-footer">
        <p>Built with React &amp; CSS Variables</p>
        <p style={{ marginTop: '0.25rem' }}>
          State: <code>Context</code> + <code>useReducer</code>
        </p>
      </footer>
    </GameProvider>
  );
}

export default App;
