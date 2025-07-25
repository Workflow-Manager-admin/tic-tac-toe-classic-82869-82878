import React, { useState, useEffect } from "react";
import "./App.css";

// Theme colors based on request
const COLOR_PRIMARY = "#1976D2";
const COLOR_SECONDARY = "#43A047";
const COLOR_ACCENT = "#FDD835";

// Helper function to check winner
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6],          // diags
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState(""); // e.g. "X's turn", "O wins!", etc
  const [gameOver, setGameOver] = useState(false);

  // statistics: { X: wins, O: wins, draws: numDraws, history: ["X", "draw", ...] }
  const [stats, setStats] = useState(() => ({
    X: 0, O: 0, draws: 0, history: [],
  }));

  // make computer turn off - all games are 2-player human
  // Updates live status on every move
  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      setStatus(`${winner} wins!`);
      setGameOver(true);
    } else if (squares.every(Boolean)) {
      setStatus("Draw!");
      setGameOver(true);
    } else {
      setStatus(`${xIsNext ? "X" : "O"}'s turn`);
    }
  }, [squares, xIsNext]);

  // On game end, update statistics
  useEffect(() => {
    if (!gameOver) return;
    const winner = calculateWinner(squares);
    setStats(prev => {
      if (winner) {
        return { ...prev, [winner]: prev[winner] + 1, history: [...prev.history, winner] };
      } else {
        return { ...prev, draws: prev.draws + 1, history: [...prev.history, "Draw"] };
      }
    });
  // only run when game just ended
  // eslint-disable-next-line
  }, [gameOver]);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (gameOver || squares[idx]) return;
    const next = squares.slice();
    next[idx] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(stats.history.length % 2 === 0); // alternate starter
    setStatus("");
    setGameOver(false);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setStatus("");
    setGameOver(false);
    setStats({ X: 0, O: 0, draws: 0, history: [] });
  }

  // Render one tile
  function Square({ value, onClick }) {
    return (
      <button
        className="ttt-square"
        style={{
          color:
            value === "X"
              ? COLOR_PRIMARY
              : value === "O"
              ? COLOR_SECONDARY
              : "inherit",
        }}
        onClick={onClick}
        aria-label={value ? value : "empty square"}
      >
        <span>{value}</span>
      </button>
    );
  }

  // Render tic tac toe board
  function Board({ squares, onClick }) {
    return (
      <div className="ttt-board">
        {[0, 1, 2].map(row => (
          <div className="ttt-board-row" key={row}>
            {[0, 1, 2].map(col => {
              const idx = 3 * row + col;
              return (
                <Square
                  key={idx}
                  value={squares[idx]}
                  onClick={() => onClick(idx)}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // Scoreboard and history display
  function Stats() {
    return (
      <div className="ttt-stats">
        <div className="ttt-score-row">
          <span style={{ color: COLOR_PRIMARY }}>X: {stats.X}</span>
          <span style={{ color: COLOR_ACCENT }}>Draws: {stats.draws}</span>
          <span style={{ color: COLOR_SECONDARY }}>O: {stats.O}</span>
        </div>
        {stats.history.length > 0 && (
          <div className="ttt-history">
            <span className="ttt-history-label">History:</span>{" "}
            {stats.history.map((res, i) =>
              res === "Draw" ? (
                <span key={i} style={{ color: COLOR_ACCENT }}>
                  Draw
                  {i !== stats.history.length - 1 ? " • " : ""}
                </span>
              ) : (
                <span
                  key={i}
                  style={{ color: res === "X" ? COLOR_PRIMARY : COLOR_SECONDARY }}
                >
                  {res}
                  {i !== stats.history.length - 1 ? " • " : ""}
                </span>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ttt-app-bg">
      <main className="ttt-main-container">
        <h1 className="ttt-title" style={{ color: COLOR_PRIMARY }}>
          Tic Tac Toe
        </h1>
        <Stats />
        <div className="ttt-status" style={{ color: status === "Draw!" ? COLOR_ACCENT : (status.includes("X") ? COLOR_PRIMARY : COLOR_SECONDARY) }}>
          {status}
        </div>
        <Board squares={squares} onClick={handleClick} />
        <div className="ttt-controls">
          <button
            className="ttt-btn"
            style={{
              background: COLOR_ACCENT,
              color: "#222",
              border: "none",
            }}
            onClick={handleRestart}
            disabled={!gameOver && squares.every((sq) => !sq)}
            aria-label="Restart Game"
          >
            Restart
          </button>
          <button
            className="ttt-btn"
            style={{
              background: COLOR_PRIMARY,
              color: "#fff",
              border: "none",
            }}
            onClick={handleReset}
            aria-label="Reset All Statistics"
          >
            Reset all
          </button>
        </div>
        <footer className="ttt-footer">
          <small>
            <span style={{ color: COLOR_ACCENT, fontWeight: 700 }}>Tip:</span>{" "}
            Touch squares to play. <span style={{ color: COLOR_PRIMARY }}>X</span> starts game.
          </small>
        </footer>
      </main>
    </div>
  );
}

export default App;
