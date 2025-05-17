export class Battle {
  id;
  player1;
  player2;
  winner = null;
  status = "waiting";
  submissions = {}; // <--- Add this

  constructor(player1, player2) {
    this.id = `${player1}-${player2}-${Date.now()}`;
    this.player1 = player1;
    this.player2 = player2;
  }

  start() {
    this.status = "in-progress";
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
    };
  }

  submitResult(playerId, passCount) {
    this.submissions[playerId] = passCount;
  }

  isReadyToEnd() {
    return (
      this.submissions[this.player1] !== undefined &&
      this.submissions[this.player2] !== undefined
    );
  }

  evaluateWinner() {
    const p1 = this.submissions[this.player1];
    const p2 = this.submissions[this.player2];
    if (p1 > p2) return this.player1;
    else if (p2 > p1) return this.player2;
    else return "tie";
  }
}
