import Cell from './Cell';

/**
 * GameBoard Component: Renders the 3x3 Tic-Tac-Toe grid.
 * Simple structure mapping indices 0 through 8 into individual Cell components.
 */
export default function GameBoard() {
  return (
    <main className="board-container" id="game-board">
      {Array(9)
        .fill(null)
        .map((_, index) => (
          <Cell key={index} index={index} />
        ))}
    </main>
  );
}
