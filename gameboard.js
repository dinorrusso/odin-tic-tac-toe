import { Cell, TokenType } from './cell.js'; // Import Cell and TokenType
import { ScoreType } from './scoreboard.js'; // Import ScoreType for checkWinner

export function Gameboard() { 

  var currentTurn = TokenType.XTURN;
  var gameOver = false;
  var gameWinner = null;

  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(new Cell());
    }
  }

  const getBoard = () => board; 

  const resetBoard = () => {
    currentTurn = TokenType.XTURN;
    gameOver = false;
    gameWinner = null;
    //reset cell values
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j].reset();
      }
    }
  };


  const turn = () => {
    return currentTurn;
  }

  const nextTurn = () => {
    if(currentTurn === TokenType.XTURN){
      currentTurn = TokenType.OTURN;
    } else currentTurn = TokenType.XTURN;
    return currentTurn;
  }

  const placeToken = (thisToken, row, col) => {
    //this does not really place a token but rather the associated score
    let targetCell = board[row][col];
    targetCell.setValue(thisToken);
    //check for winner or draw
    checkWinner();
  }

  //used for developemnt to dump board content for easy inspection
  // const displayValues = () => {
  //   for (let i = 0; i < rows; i++) {
  //     for (let j = 0; j < columns; j++) {
  //       console.log(`cell value at [${i},${j}] = [${board[i][j].getValue()}]`);
  //     }
  //   }
  // }

  const isGameOver = () => {
    return gameOver;
  }

  const winner = () => {
    return gameWinner;
  }


const checkWinner = () => {
    // Retrieve the numerical values from the Cell objects
    const boardValues = board.map(row => row.map(cell => cell.getValue()));

    const lines = [
        // Rows
        [boardValues[0][0], boardValues[0][1], boardValues[0][2]],
        [boardValues[1][0], boardValues[1][1], boardValues[1][2]],
        [boardValues[2][0], boardValues[2][1], boardValues[2][2]],
        // Columns
        [boardValues[0][0], boardValues[1][0], boardValues[2][0]],
        [boardValues[0][1], boardValues[1][1], boardValues[2][1]],
        [boardValues[0][2], boardValues[1][2], boardValues[2][2]],
        // Diagonals
        [boardValues[0][0], boardValues[1][1], boardValues[2][2]],
        [boardValues[0][2], boardValues[1][1], boardValues[2][0]]
    ];

    for (const line of lines) {
        const sum = line[0] + line[1] + line[2];
        if (sum === 3) {
          gameWinner = ScoreType.X;
          gameOver = true;
          return;
        } else if (sum === -3) {
            gameWinner = ScoreType.O;
            gameOver = true;
            return;
        }
    }

    // Check for draw using the numerical values
    const isBoardFull = boardValues.flat().every(cellValue => cellValue !== 0);
    if (isBoardFull) {
        gameWinner = ScoreType.DRAW;
        gameOver = true;
    }

    return null; // No winner yet, game continues
}
  
  return { getBoard, resetBoard, turn, nextTurn, placeToken, isGameOver, winner, displayValues};
} //end gameboard