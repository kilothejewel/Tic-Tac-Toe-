import { GameProvider } from './context/GameContext';
import GameStatus from './components/GameStatus';
import Scoreboard from './components/Scoreboard';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import MoveHistory from './components/MoveHistory';

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
      <div className="game-panel" id="game-panel">
        <div className="game-main">
          <GameStatus />
          <Scoreboard />
          <GameBoard />
          <Controls />
        </div>
        <MoveHistory />
      </div>

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
