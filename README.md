# 🎮 Tic-Tac-Toe (React + Vite)

A premium, glassmorphic Tic-Tac-Toe web application built with React, CSS variables, Context API, and `useReducer`. Features AI opponents, a move timer, undo actions, and interactive move history.

---

## 🚀 How to Launch

Follow these steps to run the project locally:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Tic-Tac-Toe-.git
   cd Tic-Tac-Toe-
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running Locally
To launch the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to the local address (typically `http://localhost:5173`).

### Production Build & Preview
To build the application for production and preview the build:
```bash
npm run build
npm run preview
```

---

## 🎲 How to Play

1. **Setup Mode:**
   - Choose your **Game Mode**:
     - 👥 **PvP (Player vs Player):** Play locally against a friend.
     - 🤖 **VS CPU:** Play against a computer opponent.
   - If playing against the CPU, select the **Difficulty**:
     - **Easy:** CPU makes random moves.
     - **Hard:** CPU makes optimal moves using the Minimax algorithm.
   - Enter player names (optional) and click **Start Game** to begin.

2. **Gameplay Rules:**
   - Taking turns, players place their symbol (`X` or `O`) on the 3x3 board.
   - **Move Timer:** Each player has **15 seconds** to make a move. If the timer runs out, the current player loses by timeout, and the other player wins.
   - The first player to align 3 of their symbols horizontally, vertically, or diagonally wins the round.
   - If all 9 cells are filled without a winner, the game ends in a Draw.

3. **In-Game Controls:**
   - ⏱️ **Timer Alert:** Watch the ticking countdown!
   - ↩️ **Undo:** Click **Undo Move** to go back. (In CPU mode, this reverts both the CPU's move and your last move).
   - 🔄 **Restart:** Reset the board to start a new round (keeps scoreboard intact).
   - 🧹 **Reset Score:** Clear the scoreboard history.
   - ⚙️ **Game Setup:** Return to the character setup page.

4. **Time Travel / Move History:**
   - Use the **Move History** sidebar to inspect all moves in the current game.
   - Click on any past move (e.g., "Go to move #3") to travel back in time and resume the game from that state.

---

## 🤝 How to Contribute

Contributions are welcome! If you'd like to improve the game, please follow these guidelines:

1. **Fork the Repository** and clone your fork locally.
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Write and Test Code:**
   - Follow standard React and CSS best practices.
   - Keep components modular and state management in `GameContext.jsx`.
   - Make sure your changes look premium and function smoothly.
4. **Lint your Code:**
   ```bash
   npm run lint
   ```
   Ensure there are no ESLint errors or warnings before committing.
5. **Commit your Changes:**
   ```bash
   git commit -m "Add some amazing feature"
   ```
6. **Push to the Branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** against the main repository branch.

---

## 🛠️ Built With
- **React** (v19) - Component architecture and hooks
- **Vite** - Rapid development build tooling
- **CSS Variables & Glassmorphism** - Rich, modern, responsive aesthetics
- **React Context & useReducer** - Robust state management system
