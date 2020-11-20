class Saves {
  constructor() {
    this.games = {};
  }

  saveGame(player, level) {
    if (!this.gameFound(player)) {
      this.games[player] = level;
    }
  }

  loadGame(player) {
    return this.games[player];
  }

  deleteGame(player) {
    delete this.games[player];
  }

  gameFound(player) {
    let players = Object.keys(this.games);
    let found = false;
    players.forEach((p) => {
      if (p === player) found = true;
    });
    return found;
  }

  showGames() {
    console.log(this.games);
  }
}

module.exports = Saves;
