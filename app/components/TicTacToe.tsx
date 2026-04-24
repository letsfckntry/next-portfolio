"use client";

import React, { useState, useEffect } from "react";

type Player = "X" | "O" | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const calculateWinner = (squares: Player[]): { winner: "X" | "O"; line: number[] } | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setScores((prev) => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1,
      }));
    } else if (board.every((square) => square !== null)) {
      setWinner("Draw");
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
  }, [board]);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-[rgba(0,217,255,0.1)] to-[rgba(0,255,204,0.05)] p-6 md:p-8 rounded-2xl border border-[rgba(0,217,255,0.3)] backdrop-blur-sm">
        {/* Score Board */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-[rgba(0,217,255,0.15)] p-3 rounded-xl text-center border border-[rgba(0,217,255,0.3)]">
            <div className="text-2xl font-bold text-[white]">X</div>
            <div className="text-sm text-white/60 mt-1">{scores.X} wins</div>
          </div>
          <div className="bg-[rgba(255,255,255,0.05)] p-3 rounded-xl text-center border border-white/10">
            <div className="text-2xl font-bold text-white/80">Draw</div>
            <div className="text-sm text-white/60 mt-1">{scores.draws}</div>
          </div>
          <div className="bg-[rgba(0,255,204,0.15)] p-3 rounded-xl text-center border border-[rgba(0,255,204,0.3)]">
            <div className="text-2xl font-bold text-[white]">O</div>
            <div className="text-sm text-white/60 mt-1">{scores.O} wins</div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-4">
          {winner ? (
            <div className="text-xl font-bold">
              {winner === "Draw" ? (
                <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text" style={{WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                  It's a Draw!
                </span>
              ) : (
                <span className="bg-gradient-to-r from-[white] to-[white] bg-clip-text" style={{WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                  Player {winner} Wins! 🎉
                </span>
              )}
            </div>
          ) : (
            <div className="text-lg text-white/80">
              Next Player:{" "}
              <span className={`font-bold ${isXNext ? "text-[white]" : "text-[white]"}`}>
                {isXNext ? "X" : "O"}
              </span>
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={!!cell || !!winner}
              className={`
                aspect-square rounded-lg text-4xl font-bold transition-all
                ${cell 
                  ? winningLine.includes(index)
                    ? "bg-gradient-to-br from-[white] to-[white] border-2 border-[white] shadow-lg shadow-white/50 animate-pulse"
                    : "bg-[rgba(0,217,255,0.2)] border-2 border-[rgba(0,217,255,0.4)]"
                  : "bg-[rgba(255,255,255,0.05)] border-2 border-white/10 hover:bg-[rgba(0,217,255,0.15)] hover:border-[rgba(0,217,255,0.3)]"
                }
                ${!cell && !winner ? "cursor-pointer active:scale-95" : "cursor-not-allowed"}
                disabled:opacity-50
              `}
            >
              {cell && (
                <span className={cell === "X" ? "text-[white]" : "text-[white]"}>
                  {cell}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={resetGame}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold border-2 border-[rgba(0,217,255,0.5)] text-white bg-[rgba(0,217,255,0.1)] hover:bg-[rgba(0,217,255,0.2)] hover:border-[white] transition-all active:scale-95"
          >
            New Game
          </button>
          <button
            onClick={resetScores}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold border-2 border-[rgba(255,255,255,0.2)] text-white bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] hover:border-white/30 transition-all active:scale-95"
          >
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  );
}
