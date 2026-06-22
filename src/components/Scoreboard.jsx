import { useGame } from '../context/GameContext';

/**
 * Scoreboard Component: Displays card panels with wins for X,
 * draws, and wins for O (which labels as Computer when in AI mode).
 */
export default function Scoreboard() {
  const { scores, gameMode, playerNames } = useGame();

  return (
    <section className="scoreboard" id="game-scoreboard" aria-label="Scoreboard stats">
      <div className="score-card x-card" id="score-x">
        <div className="score-label">{playerNames?.X || 'Player X'}</div>
        <div className="score-val">{scores.X}</div>
      </div>
      <div className="score-card draw-card" id="score-draws">
        <div className="score-label">Draws</div>
        <div className="score-val">{scores.draws}</div>
      </div>
      <div className="score-card o-card" id="score-o">
        <div className="score-label">
          {playerNames?.O || (gameMode === 'ai' ? 'CPU' : 'Player O')}
        </div>
        <div className="score-val">{scores.O}</div>
      </div>
    </section>
  );
}
