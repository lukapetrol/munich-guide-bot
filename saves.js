class Saves {
  constructor() {
    this.games = {};
  }

  saveGame(player, level) {
    this.games[player] = level;
  }

  loadGame(player) {
    if(this.gameFound(player)) {
        return { "player": player, "level": this.games[player] };
    } else  {
        return { "player": player, "level": 0 };
    }
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
