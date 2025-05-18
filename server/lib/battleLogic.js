export class Battle {
  id;
  player1;
  player2;
  winner = null;
  status = "waiting";

  player1PassCount = null;
  player2PassCount = null;

  constructor(player1, player2) {
    this.id = `${player1}-${player2}-${Date.now()}`;
    this.player1 = player1;
    this.player2 = player2;
  }

  start() {
    this.status = "in-progress";
  }

  submitCode(socketId, passCount) {
    if (socketId === this.player1) {
      this.player1PassCount = passCount;
    } else if (socketId === this.player2) {
      this.player2PassCount = passCount;
    }

    // If both players submitted, decide the winner
    if (this.player1PassCount !== null && this.player2PassCount !== null) {
      if (this.player1PassCount > this.player2PassCount) {
        this.end(this.player1);
      } else if (this.player2PassCount > this.player1PassCount) {
        this.end(this.player2);
      } else {
        this.end("draw"); // Or null if you prefer
      }
    }
  }

  end(winner) {
    this.status = "finished";
    this.winner = winner;
  }

  toJSON() {
    return {
      id: this.id,
      player1: this.player1,
      player2: this.player2,
      winner: this.winner,
      status: this.status,
      player1PassCount: this.player1PassCount,
      player2PassCount: this.player2PassCount,
    };
  }
}
