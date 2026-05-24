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

    /* 
     ========================================================================
     🎓 TEACHABLE MOMENT & MANUAL INTERN ASSIGNMENT (15 MARKS)
     ========================================================================
     No AI/Cursor allowed for this! You need to implement the UNDO functionality.
     
     Here are your requirements & design directions for Option C (Undo Move):
     
     1. How to revert the board?
        - You need to access the history array: `state.history`.
        - The current board is the last element: `state.history[state.history.length - 1]`.
        - To undo, you want to revert to a previous board state in the history.
        
     2. Handling PvP vs AI undoing:
        - In PvP mode: Clicking undo should step back exactly 1 move.
          New board becomes `state.history[state.history.length - 2]`.
          New history should have the last element removed (popped).
          Turn player (`xIsNext`) must be toggled back.
          
        - In Play vs AI mode: Since the computer plays immediately after you,
          stepping back 1 move would revert to the board *after* your click (which is the AI's turn).
          The AI would immediately move again!
          To fix this, in AI mode you must step back 2 moves:
          New board becomes `state.history[state.history.length - 3]`.
          New history should have the last two elements removed.
          (Make sure history has at least 3 states before undoing 2 moves,
          otherwise if length is 2 or 3, you can just reset to initial board).
          
     3. Adjusting Scores on Undo (Optional/Extra Credit):
        - If a player undid a winning move, you should decrement the win counter!
          To do this cleanly, think about comparing the outcome of the undone board
          versus the current board. Or just disable undoing once the game is won.
          For this intern project, disabling the Undo button in the UI once the
          game is over is a highly clean and recommended UX choice!
     ========================================================================
    */
    case 'UNDO': {
      // TODO: Implement the UNDO logic here.
      // 1. Check if history length permits undoing.
      // 2. Determine target index to rollback to based on state.gameMode.
      // 3. Slice the history array to remove the rolled-back moves.
      // 4. Determine correct turn direction (xIsNext).
      // 5. Handle corner cases (e.g. reverting back to the initial state).
      
      // For now, it does nothing. Implement this without AI in your session!
      console.warn("UNDO action triggered but not implemented yet in gameReducer!");
      return state; 
    }

    /*
     ========================================================================
     🎓 TEACHABLE MOMENT & MANUAL INTERN ASSIGNMENT (Alternative Option)
     ========================================================================
     If you choose Option B (Scoreboard reset) or want to add a Reset Scores action,
     this is where it goes. It should reset the state.scores back to zero.
     ========================================================================
    */
    case 'RESET_SCORE': {
      // TODO: Implement the RESET_SCORE logic here.
      // It should set state.scores back to { X: 0, O: 0, draws: 0 } without clearing the board.
      
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
