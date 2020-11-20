require('dotenv').config();
const Telegraf = require("telegraf");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const fs = require("fs");
const path = require("path");

const envelopesRawData = fs.readFileSync("envelopes.json");
const envelopesJSON = JSON.parse(envelopesRawData);

let Saves = require("./saves.js");
let saves = new Saves();

let Ladder = require("./ladder.js");
let ladder = new Ladder();


const bot = new Telegraf(process.env.TELEGRAM_TOKEN); // get the token from envirenment variable

// bot.telegram.setWebhook(`${process.env.HEROKU_URL}/bot${process.env.TELEGRAM_TOKEN}`);
// bot.startWebhook(`/bot${process.env.TELEGRAM_TOKEN}`, null, process.env.PORT);

 

const stage = new Stage();
bot.use(session());
bot.use(stage.middleware());

const envelopeOrder = [
  6,
  7,
  12,
  5,
  9,
  13,
  16,
  2,
  10,
  3,
  15,
  11,
  1,
  8,
  14,
  18,
  20,
  17,
  4,
  19,
  21,
];


const game = new Scene("game");
stage.register(game);

const startMessage = `
Greetings traveller! You just arrived in Munich a few days or weeks ago I assume. The city can seem big and scary at first. But do not worry! With some navigational skills as well as some simple math I will guide you through the historical core of the city on this years inner city scavenger hunt.
To start the scavenger hunt enter /newgame .
For all available commands enter /help .
Please make sure you have registerd a Telegram-Username to be able to participate in the scavenger hunt.`;

bot.start((ctx) => ctx.reply(startMessage));

bot.command("help", (ctx) => {
  ctx.reply(`Here is a list of all available commands:
/help - List all commands
/newgame - Start a new scavenger hunt.
/resumegame - Resume an your scavenger hunt.
/endgame - End your current scavenger hunt.
/ladder - Show the first ten players to finish the scavenger hunt.
/clue - Shows the last clue.`);
});

bot.command("ladder", (ctx) => {
  ctx.reply(`Here is the current ladder:\n${ladder.parseLadder()}`);
});

bot.command("newgame", (ctx) => {
  if (typeof ctx.from.username !== "undefined") {
    ctx.session.save = { player: ctx.from.username, level: 0 };
    saves.saveGame(ctx.session.save.player, ctx.session.save.level);
    ctx.reply("Starting new game. Get ready for your first clue.");
    ctx.scene.enter("game");
  } else {
    ctx.reply(
      'It appears that you haven\'t registert a Telegram-Username. Please enter your Username under "Telegram > Settings" before participating in the scavanger hunt.'
    );
  }
});

bot.command("resumegame", (ctx) => {
  if (typeof ctx.from.username !== undefined) {
    if (gameFound(ctx.from.username)) {
      ctx.session.save = saves.loadGame(ctx.from.username);
      ctx.reply(
        `Game found. Your scavanger hunt will be resumed. Here is your last clue:`
      );
      ctx.scene.leave();
      ctx.scene.enter("game");
    } else {
      ctx.reply(
        "A game with your registered Telegram-Username could not be found. Please start a new game by entering /newgame."
      );
    }
  } else {
    ctx.reply(
      'It appears that you haven\'t registert a Telegram-Username. Please enter your Username under "Telegram > Settings" before participating in the scavanger hunt.'
    );
  }
});

bot.command("clue", (ctx) => {
  ctx.reply("Please enter a game by using /newgame or /resumegame.");
});

game.enter((ctx) => {
  ctx.reply(
    `${envelopesJSON[ctx.session.save.level].clue}\n\n${
      envelopesJSON[ctx.session.save.level].task
    }`
  );
});

game.on("text", (ctx) => {
  if (ctx.message.text === String(envelopeOrder[ctx.session.save.level])) {
    ctx.session.save.level++;
    console.log(ctx.session.save);
    saves.saveGame(ctx.session.save.player, ctx.session.save.level);
    ctx.reply(
      `Congrats! Your answer is right. Here is the next clue:\n\n${
        envelopesJSON[ctx.session.save.level].clue
      }\n\n${envelopesJSON[ctx.session.save.level].task}`
    );
  } else if (ctx.message.text === "/endgame") {
    ctx.reply(
      "Leaving the current scavanger hunt. Your progress will be saved"
    );
    saves.saveGame(ctx.session.save.player, ctx.session.save.level);
    ctx.scene.leave();
  } else if (ctx.message.text === "/newgame") {
    ctx.reply("Your scavanger hunt is already in progress.");
  } else if (ctx.message.text === "/ladder") {
    ctx.reply(`Here is the current ladder:\n${ladder.parseLadder()}`);
  } else if (ctx.message.text === "/help") {
    ctx.reply(`Here is a list of all available commands:
/help - List all commands
/newgame - Start a new scavenger hunt.
/resumegame - Resume an your scavenger hunt.
/endgame - End your current scavenger hunt.
/ladder - Show the first ten players to finish the scavenger hunt.
/clue - Shows the last clue.`);
  } else if (ctx.message.text === "/clue") {
    ctx.reply(
      `Here is your last clue:\n\n${
        envelopesJSON[ctx.session.save.level].clue
      }\n\n${envelopesJSON[ctx.session.save.level].task}`
    );
  } else {
    ctx.reply("Your number is incorrect. Try again.");
  }
  if (ctx.session.save.level === 20) {
    ctx.reply(
      "Congratulations! You have sucessfully finished the scavenger hunt."
    );
    ladder.addPlayer(ctx.session.save.player);
    saves.deleteGame(ctx.session.save.player);
    ctx.scene.leave();
  }
});


bug

bot.launch();