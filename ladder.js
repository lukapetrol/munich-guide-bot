class Ladder {
  constructor() {
    this.ranks = [
      { place: 1, player: "" },
      { place: 2, player: "" },
      { place: 3, player: "" },
      { place: 4, player: "" },
      { place: 5, player: "" },
      { place: 6, player: "" },
      { place: 7, player: "" },
      { place: 8, player: "" },
      { place: 9, player: "" },
      { place: 10, player: "" },
    ];
  }

  parseLadder() {
    ladderString = "";
    this.ranks.forEach((r) => {
      ladderString += `Place ${r.place}: ${r.player}\n`;
    });
    return ladderString;
  }

  addPlayer(player) {
    let skip = false;
    this.ranks.forEach((r) => {
      if (!skip) {
        if (r.player === player) skip = true;
        if (r.player === "" && !skip) {
          r.player = player;
          skip = true;
        }
      }
    });
  }

  showLadder() {
    console.log(this.ranks);
  }
}

module.exports = Ladder;
