/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect } from 'react';
import { calculateWinner, checkDraw, getRandomMove, getBestMove } from '../utils/ai';

// 1. Create the Context
const GameContext = createContext();

// 2. Define Initial State
const initialState = {
  board: Array(9).fill(null),
  xIsNext: true,
  // We store a history of boards to enable Undo and Time Travel features.
  // Each entry is a 9-element array snapshot of the board.
  history: [Array(9).fill(null)],
  currentStep: 0, // Tracks the currently active board state in the history stack
  scores: { X: 0, O: 0, draws: 0 },
  gameMode: 'pvp', // 'pvp' | 'ai'
  aiDifficulty: 'hard', // 'easy' | 'hard'
  isAiMoving: false, // Prevents clicks while computer is "thinking"
  timeLeft: 15, // Seconds remaining for the current move
  timeoutWinner: null, // Tracks if a player won because of a timeout
  playerNames: { X: 'Player X', O: 'Player O' },
  gameStarted: false,
};

// 3. Define the Reducer Function
function gameReducer(state, action) {
  switch (action.type) {
    case 'MAKE_MOVE': {
      const { index } = action.payload;
      const { board, xIsNext, history, currentStep, scores } = state;

      // Calculate if the game is already over
      const { winner } = calculateWinner(board);
      const isDraw = checkDraw(board);

      // Prevent moving if cell is filled, game is over, or timed out
      if (board[index] || winner || isDraw || state.timeoutWinner) {
        return state;
      }

      // Truncate the history to the current step (discards any "undone" or "future" moves)
      const cleanHistory = history.slice(0, currentStep + 1);

      // Create new board state
      const newBoard = [...cleanHistory[currentStep]];
      newBoard[index] = xIsNext ? 'X' : 'O';

      // Record this move in the history stack
      const newHistory = [...cleanHistory, newBoard];
      const newStep = newHistory.length - 1;

      // Re-evaluate game status to update score card immediately
      const newOutcome = calculateWinner(newBoard);
      const newDraw = checkDraw(newBoard);
      
      let newScores = { ...scores };
      if (newOutcome.winner) {
        newScores[newOutcome.winner] += 1;
      } else if (newDraw) {
        newScores.draws += 1;
      }

      return {
        ...state,
        board: newBoard,
        xIsNext: !xIsNext,
        history: newHistory,
        currentStep: newStep,
        scores: newScores,
        timeLeft: 15, // Reset timer
        timeoutWinner: null,
      };
    }

    case 'RESET': {
      // Normal restart: Resets board and history, but PRESERVES the scoreboard.
      return {
        ...state,
        board: Array(9).fill(null),
        xIsNext: true,
        history: [Array(9).fill(null)],
        currentStep: 0,
        isAiMoving: false,
        timeLeft: 15, // Reset timer
        timeoutWinner: null,
      };
    }

    case 'SET_GAME_MODE': {
      // Changing modes resets the board and the scoreboard to ensure a fresh game.
      const isAi = action.payload === 'ai';
      return {
        ...initialState,
        gameMode: action.payload,
        playerNames: {
          X: state.playerNames?.X || 'Player X',
          O: isAi ? 'CPU' : 'Player O'
        },
        gameStarted: false,
        timeLeft: 15,
        timeoutWinner: null,
      };
    }

    case 'START_GAME': {
      const { X, O } = action.payload;
      return {
        ...state,
        playerNames: { X, O },
        gameStarted: true,
        board: Array(9).fill(null),
        xIsNext: true,
        history: [Array(9).fill(null)],
        currentStep: 0,
        isAiMoving: false,
        timeLeft: 15,
        timeoutWinner: null,
      };
    }

    case 'GO_TO_SETUP': {
      return {
        ...state,
        gameStarted: false,
      };
    }

    case 'SET_DIFFICULTY': {
      return {
        ...state,
        aiDifficulty: action.payload,
      };
    }

    case 'SET_AI_MOVING': {
      return {
        ...state,
        isAiMoving: action.payload,
      };
    }

    case 'UNDO': {
      const { history, currentStep, gameMode } = state;
      // In PvP mode, undo 1 step. In AI mode, undo 2 steps so we return to human's turn.
      const stepsToUndo = gameMode === 'ai' ? 2 : 1;
      const targetStep = Math.max(0, currentStep - stepsToUndo);
      
      return {
        ...state,
        board: history[targetStep],
        xIsNext: targetStep % 2 === 0,
        currentStep: targetStep,
        timeLeft: 15, // Reset timer
        timeoutWinner: null,
      };
    }

    case 'RESET_SCORE': {
      return {
        ...state,
        scores: { X: 0, O: 0, draws: 0 },
      };
    }

    case 'JUMP_TO_STEP': {
      const stepIndex = action.payload;
      const { history } = state;
      if (stepIndex < 0 || stepIndex >= history.length) {
        return state;
      }
      return {
        ...state,
        board: history[stepIndex],
        xIsNext: stepIndex % 2 === 0,
        currentStep: stepIndex,
        timeLeft: 15, // Reset timer
        timeoutWinner: null,
      };
    }

    case 'TICK': {
      // If the game is already over (by normal win, draw, or timeout), don't tick
      const { winner } = calculateWinner(state.board);
      const isDraw = checkDraw(state.board);
      if (state.timeoutWinner || winner || isDraw) {
        return state;
      }

      const newTimeLeft = Math.max(0, state.timeLeft - 1);
      if (newTimeLeft === 0) {
        // Current player timed out, so the opponent wins
        const winner = state.xIsNext ? 'O' : 'X';
        const newScores = { ...state.scores };
        newScores[winner] += 1;
        return {
          ...state,
          timeLeft: 0,
          timeoutWinner: winner,
          scores: newScores,
        };
      }

      return {
        ...state,
        timeLeft: newTimeLeft,
      };
    }

    default:
      return state;
  }
}

// 4. Provider Component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Compute game conditions dynamically from the current board state and timeout state
  const { winner: boardWinner, line: winningLine } = calculateWinner(state.board);
  const winner = state.timeoutWinner || boardWinner;
  const isDraw = !state.timeoutWinner && checkDraw(state.board);

  // Time ticking interval effect
  useEffect(() => {
    if (winner || isDraw) {
      return;
    }

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(interval);
  }, [winner, isDraw, state.currentStep]);

  // AI Turn Handling Effect
  useEffect(() => {
    // Only run if: 
    // - Mode is AI
    // - It is O's turn (AI is 'O')
    // - The game is not over
    // - AI is not already computing
    if (
      state.gameMode === 'ai' &&
      !state.xIsNext &&
      !winner &&
      !isDraw &&
      !state.isAiMoving
    ) {
      dispatch({ type: 'SET_AI_MOVING', payload: true });

      const timer = setTimeout(() => {
        let bestIndex;
        if (state.aiDifficulty === 'hard') {
          bestIndex = getBestMove(state.board);
        } else {
          bestIndex = getRandomMove(state.board);
        }

        if (bestIndex !== -1) {
          dispatch({ type: 'MAKE_MOVE', payload: { index: bestIndex } });
        }
        dispatch({ type: 'SET_AI_MOVING', payload: false });
      }, 600); // 600ms artificial thinking delay

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.board, state.xIsNext, state.gameMode, state.aiDifficulty, winner, isDraw]);

  // Context value bundle
  const value = {
    ...state,
    winner,
    winningLine,
    isDraw,
    makeMove: (index) => dispatch({ type: 'MAKE_MOVE', payload: { index } }),
    resetGame: () => dispatch({ type: 'RESET' }),
    resetScore: () => dispatch({ type: 'RESET_SCORE' }),
    undoMove: () => dispatch({ type: 'UNDO' }),
    setGameMode: (mode) => dispatch({ type: 'SET_GAME_MODE', payload: mode }),
    setDifficulty: (diff) => dispatch({ type: 'SET_DIFFICULTY', payload: diff }),
    jumpToStep: (stepIndex) => dispatch({ type: 'JUMP_TO_STEP', payload: stepIndex }),
    startGame: (names) => dispatch({ type: 'START_GAME', payload: names }),
    goToSetup: () => dispatch({ type: 'GO_TO_SETUP' }),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// 5. Custom Hook for clean consumption
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
