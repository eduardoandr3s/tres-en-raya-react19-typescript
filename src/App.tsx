import { useState } from "react";


interface SquareProps {
  value: 'X' | 'O' | null;
  onSquareClick: () => void;
  className?: string; // con esto le digo que es opcional ya que no me tomaba el ternario para resaltar las casillas ganadoras
}

function Square({ value, onSquareClick, className }: SquareProps) {
  return (
    <button
      className={className || 'square'}
      onClick={onSquareClick}>
      {value}
    </button>
  );
}

interface BoardProps {
  xIsNext: boolean;
  squares: Array<'X' | 'O' | null>;
  onPlay: (nextSquares: Array<'X' | 'O' | null>) => void;
}


function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {

    if (squares[i] || calculateWinner(squares).winner) {
      return;
    }
    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares)

  }

  const {winner, winningSquares} = calculateWinner(squares);
  const isDraw = squares.every((Square) => Square !== null) && !winner;

  let status;
  if (winner) {
    status = "Ganador: " + winner;
  } else if(isDraw){
    status = "Empate";
  } else {
    status = "Siguiente jugador: " + (xIsNext ? 'X' : 'O');
  }

  const board = [];
  for (let row = 0; row < 3; row++) {
    const squaresRow = [];
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      const isWinningSquare = winningSquares.includes(index);
      squaresRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          className={isWinningSquare ? 'square winning-square' : 'square'}
        />
      );
    }
    board.push(
      <div key={row} className="board-row">
        {squaresRow}
      </div>
    );

  }
  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  )
}

export default function Game() {
  const [history, setHistory] = useState<Array<Array<'X' | 'O' | null>>>([Array(9).fill(null)]); // lo inicializo con un tablero vacío
  const [currentMove, setCurrentMove] = useState(0); // con esto guardo el estado del turno
  const [isAscending, setIsAscending] = useState(true); // con esto guardo el estado del orden de los movimientos
  const xIsNext = (currentMove % 2 === 0); // con esto guardo el estado del turno
  const currentSquares = history[currentMove]; // con esto guardo el estado actual del tablero



  function handlePlay(nextSquares: Array<'X' | 'O' | null>) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // con esto guardo el estado actual del tablero
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1); // con esto guardo el estado actual del turno
  }



  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Ir al movimiento #' + move;
    } else {
      description = 'Ir al inicio del juego';
    }

    if (move === currentMove) {
      return (
        <li key={move}>
          <span>Estás en el movimiento #{move}</span>
        </li>
      )
    }


    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )

  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();


  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}> {isAscending ? 'Ordenar Descendente' : 'Ordenar Ascendente'}</button>
        
        
        <ul>
          {sortedMoves}
        </ul>
      </div>
    </div>
  )

}



function calculateWinner(squares: Array<'X' | 'O' | null>): { winner: 'X' | 'O' | null; winningSquares: number[] } {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], winningSquares: [a, b, c]};
    }
  }
  return {winner: null, winningSquares: []};
}
