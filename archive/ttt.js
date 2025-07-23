
const ScoreType = Object.freeze({
  X: 'X',
  O: 'O',
  DRAW: 'Draw'
});

const TokenType = Object.freeze({
  XTURN: 'xtoken',
  OTURN: 'otoken'
})
 
class Scoreboard {
  // Private fields
  #xScore = 0;
  #oScore = 0;
  #drawScore = 0;

  constructor() {
    // Initialization is handled by private field declarations
  }

  // Public methods to access the private scores
  getXScore() {
    return this.#xScore;
  }

  getOScore() {
    return this.#oScore;
  }

  getDrawScore() {
    return this.#drawScore;
  }

  // Reset all scores to zero
  zero() {
    this.#xScore = 0;
    this.#oScore = 0;
    this.#drawScore = 0;
  }

  // Increment a score by ScoreType (ScoreType.X, ScoreType.O, or ScoreType.DRAW)
  increment(scoreType) {
    switch (scoreType) {
      case ScoreType.X:
        this.#xScore++;
        break;
      case ScoreType.O:
        this.#oScore++;
        break;
      case ScoreType.DRAW:
        this.#drawScore++;
        break;
      default:
        console.warn("Invalid score type:", scoreType);
        break;
    }
  }
}

class Cell {
  // Private field
  // 1 means X
  // -1 means O
  // 0 means empty
  #value = 0;

  constructor() {
    // Initialization is handled by private field declarations
  }

  // Public methods
  getValue() {
    return this.#value;
  }
  setValue(tokenType) {
    switch (tokenType) {
      case TokenType.XTURN:
        this.#value = 1;
        break;
      case TokenType.OTURN:
        this.#value = -1;
        break;
      default:
        console.warn("Invalid token type:", tokenType);
        break;
    }
  }
   reset() {  
    this.#value = 0;
  }
}

function Gameboard() {

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
    console.log(`in reset board currentTurn = ${currentTurn}`);
    console.log(`in reset board turn = ${turn()}`);
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
    targetCell = board[row][col];
    console.log(`cell at [${row},${col}] being set to ${thisToken}`);
    targetCell.setValue(thisToken);
    console.log(`cell value = [${board[row][col].getValue()}]`)
    //check for winner or draw
    checkWinner();
  }

  const displayValues = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        console.log(`cell value at [${i},${j}] = [${board[i][j].getValue()}]`);
      }
    }
  }

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

function uiController(){
   /*
  The gameboardDiv controls the ui behavior based on its class
  the start value is <div class="gameboard xtoken"> where xtoken
  and the corresponding otoken drive the styling of the board's 
  cursor and board cell presentation.
  */
  
  const gameboardDiv = document.querySelector('.gameboard');
  const board = Gameboard();
  let turn = board.turn();
  gameboardDiv.className = `gameboard ${turn}`;
  const scoreboard = new Scoreboard();
  
  const messageText = document.getElementById('message-text');
  const restartButton = document.querySelector('.restart');

  restartButton.addEventListener('click', (event) => {
    console.log("starting restart button click handler.");
    //reset the ui elements - cells
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.className = 'cell';
    });
    board.resetBoard();
    turn = board.turn();
    gameboardDiv.className = `gameboard ${turn}`;
     // Also remove the 'gameover' class from the button so it hides again
    restartButton.classList.remove('gameover');
    
    // Clear the message text
    messageText.textContent = '';
    document.querySelector('.message').classList.remove('message-active');
  }); //restart button event listener

  //utility function for scoreboard display
  function refreshScoreboard(scoreboard) {
    const xscore = document.querySelector('.p1-score');
    xscore.textContent = scoreboard.getXScore();
    const drawscore = document.querySelector('.draw-score');
    drawscore.textContent = scoreboard.getDrawScore();
    const oscore = document.querySelector('.p2-score');
    oscore.textContent = scoreboard.getOScore();
  }

  //setup event listener for clicking a cell
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
  cell.addEventListener('click', (event) => {
    /*
    make sure we do not allow cell to be clicked twice
    or after game is over

    set the token by changing the cell's class

    set the cell's value so you can test for winner
    reduce remaining cells by 1
    see if you have a winner or draw (defer for now)

    assume no winner or draw then
    board.nextTurn() - changes the cursor to O

    */ 
    // make sure cell has not already been clicked
    if (cell.classList.contains('clicked')) return; //do nothing
    if (restartButton.classList.contains('gameover')) return;
    //set the cell's token by changing the cell's class
    cell.classList.add(turn);
    //mark the cell as clicked
    cell.classList.add('clicked');
    //place the token on the game board
    //set the cell's value so you can test for winner TODO
    row = Math.floor(cell.id/3);
    col = cell.id%3;
    // use compted row, col to set the appropriate cell

    board.placeToken(turn,row,col); //TODO TEST THIS
    board.displayValues();


    // if the game is not over setup for next turn
    if (!board.isGameOver()){
      turn = board.nextTurn();
      gameboardDiv.className = `gameboard ${turn}`;
    }else{
      //do game over stuff

     
      //see if we have a winner or it is a draw and set game over message
      const roundWinner = board.winner();
      scoreboard.increment(roundWinner);
      switch (roundWinner) {
      case ScoreType.X:
        messageText.textContent = `${ScoreType.X} wins!`;
        break;
      case ScoreType.O:
        messageText.textContent = `${ScoreType.O} wins!`;
        break;
      case ScoreType.DRAW:
        messageText.textContent = `It's a ${ScoreType.DRAW}!`;
        break;
      default:
        console.warn("Invalid winner:", roundWinner);
        break;
    } 
      document.querySelector('.message').classList.add('message-active');
      restartButton.classList.add('gameover');
      refreshScoreboard(scoreboard);
    }
  }); //event listener
  refreshScoreboard(scoreboard);
});

}
//run the game
uiController();