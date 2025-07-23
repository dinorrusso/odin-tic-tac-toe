import { Scoreboard, ScoreType } from './scoreboard.js'; 
import { Gameboard } from './gameboard.js'; 

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
    let row = Math.floor(cell.id/3);
    let col = cell.id%3;
    // use computed row, col to set the appropriate cell

    board.placeToken(turn,row,col); 
    


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

uiController();