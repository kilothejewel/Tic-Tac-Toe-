import { useGame } from '../context/GameContext';

/**
 * Cell Component: A single square on the 3x3 board.
 * It is a "dumb" component that reads its value and handles click actions
 * by consuming the game context.
 */
export default function Cell({ index }) {
  const { board, makeMove, winningLine, isAiMoving, winner, isDraw } = useGame();
  
  const value = board[index];
  
  // Cell is interactable if it is empty, the game isn't finished, and AI is not active
  const isPlayable = !value && !winner && !isDraw && !isAiMoving;
  
  // Check if this cell is part of the winning row/col/diagonal
  const isWinningCell = winningLine && winningLine.includes(index);

  // Dynamic CSS classes for design states
  const getCellClasses = () => {
    let classes = 'cell-button';
    if (value === 'X') classes += ' x-marker';
    if (value === 'O') classes += ' o-marker';
    if (isWinningCell) classes += ' winning-cell';
    if (isPlayable) classes += ' playable';
    return classes;
  };

  return (
    <button
      type="button"
      id={`cell-${index}`}
      className={getCellClasses()}
      onClick={() => isPlayable && makeMove(index)}
      disabled={!isPlayable}
      aria-label={`Board cell position ${index + 1}`}
    >
      {value}
    </button>
  );
}
