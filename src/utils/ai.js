/**
 * Tic-Tac-Toe Game Logic Utilities
 */

/**
 * Calculates the winner and the winning combination line.
 * @param {Array} board - Flat array of 9 elements (strings or null)
 * @returns {Object} { winner: 'X' | 'O' | null, line: Array<number> | null }
 */
export function calculateWinner(board) {
  const lines = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Column 1
    [1, 4, 7], // Column 2
    [2, 5, 8], // Column 3
    [0, 4, 8], // Diagonal 1
    [2, 4, 6]  // Diagonal 2
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: lines[i] };
    }
  }

  return { winner: null, line: null };
}

/**
 * Checks if the board is full with no winner (Draw).
 * @param {Array} board 
 * @returns {boolean}
 */
export function checkDraw(board) {
  const { winner } = calculateWinner(board);
  return winner === null && board.every(cell => cell !== null);
}

/**
 * Easy AI difficulty: returns a random empty spot index.
 * @param {Array} board 
 * @returns {number} Selected index (0-8) or -1 if full
 */
export function getRandomMove(board) {
  const emptyIndices = board
    .map((cell, index) => (cell === null ? index : null))
    .filter((val) => val !== null);

  if (emptyIndices.length === 0) return -1;
  const randomIndex = Math.floor(Math.random() * emptyIndices.length);
  return emptyIndices[randomIndex];
}

/**
 * Minimax algorithm helper for Hard AI difficulty.
 * AI is 'O' (maximizing player), Human is 'X' (minimizing player).
 */
function minimax(board, depth, isMaximizing) {
  const { winner } = calculateWinner(board);
  
  // Base cases: returns score
  if (winner === 'O') return 10 - depth;  // AI wins: favor quicker wins
  if (winner === 'X') return depth - 10;  // Human wins: favor longer paths to defeat
  if (board.every(cell => cell !== null)) return 0; // Draw

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O'; // Make move
        const score = minimax(board, depth + 1, false);
        board[i] = null; // Undo move
        bestScore = Math.max(bestScore, score);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X'; // Make move
        const score = minimax(board, depth + 1, true);
        board[i] = null; // Undo move
        bestScore = Math.min(bestScore, score);
      }
    }
    return bestScore;
  }
}

/**
 * Hard AI difficulty: returns the best move index using Minimax.
 * @param {Array} board 
 * @returns {number} Best index (0-8)
 */
export function getBestMove(board) {
  let bestScore = -Infinity;
  let bestMove = -1;

  // Search through all empty cells
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'O'; // Make move for AI
      const score = minimax(board, 0, false);
      board[i] = null; // Undo move
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}
