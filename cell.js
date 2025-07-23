export const TokenType = Object.freeze({ 
  XTURN: 'xtoken', 
  OTURN: 'otoken' 
});

/*
Cells are what contains the values which represent what token was played.
Currently the cell contents are either 1, 0, or -1 indicating X, empty, or O respectively.
I chose this in order to support determining if there was a winner or a draw.

The gameboard uses this information to determine the state of the game.
Making the cell values private may have been overkill in retrospect...
I may reconsider...
*/
export class Cell { 

  #value = 0; 

  constructor() {
 
  }

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