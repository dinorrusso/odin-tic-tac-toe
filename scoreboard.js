export const ScoreType = Object.freeze({ //
  X: 'X', //
  O: 'O', //
  DRAW: 'Draw' //
});

export class Scoreboard {
  // Private fields
  #xScore = 0;
  #oScore = 0;
  #drawScore = 0;

  constructor() {
    
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