import React, { createContext, useContext, useReducer, useEffect } from 'react';
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
  scores: { X: 0, O: 0, draws: 0 },
  gameMode: 'pvp', // 'pvp' | 'ai'
  aiDifficulty: 'hard', // 'easy' | 'hard'
  isAiMoving: false, // Prevents clicks while computer is "thinking"
};

// 3. Define the Reducer Function
function gameReducer(state, action) {
  switch (action.type) {
    case 'MAKE_MOVE': {
      const { index } = action.payload;
      const { board, xIsNext, history, scores, gameMode, isAiMoving } = state;

      // Calculate if the game is already over
      const { winner } = calculateWinner(board);
      const isDraw = checkDraw(board);

      // Prevent moving if cell is filled, game is over, or AI is currently moving
      if (board[index] || winner || isDraw || isAiMoving) {
        return state;
      }

      // Create new board state
      const newBoard = [...board];
      newBoard[index] = xIsNext ? 'X' : 'O';

      // Record this move in the history stack
      const newHistory = [...history, newBoard];

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
        scores: newScores,
      };
    }

    case 'RESET': {
      // Normal restart: Resets board and history, but PRESERVES the scoreboard.
      return {
        ...state,
        board: Array(9).fill(null),
        xIsNext: true,
        history: [Array(9).fill(null)],
        isAiMoving: false,
      };
    }

    case 'SET_GAME_MODE': {
      // Changing modes resets the board and the scoreboard to ensure a fresh game.
      return {
        ...initialState,
        gameMode: action.payload,
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
      // TODO: Implement the UNDO logic here.
      console.warn("UNDO action triggered but not implemented yet in gameReducer!");
      return state; 
    }

    case 'RESET_SCORE': {
      // TODO: Implement the RESET_SCORE logic here.
      console.warn("RESET_SCORE action triggered but not implemented yet!");
      return state; 
    }

    default:
      return state;
  }
}

// 4. Provider Component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Compute game conditions dynamically from the current board state
  const { winner, line: winningLine } = calculateWinner(state.board);
  const isDraw = checkDraw(state.board);

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
  }, [state.board, state.xIsNext, state.gameMode, state.aiDifficulty, state.isAiMoving, winner, isDraw]);

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
