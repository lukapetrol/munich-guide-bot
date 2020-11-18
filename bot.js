// require("custom-env").env("staging");
require('dotenv').config();
const Telegraf = require("telegraf"); // import telegram lib
// const TelegramBot = require('node-telegram-bot-api');
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const express = require("express")
// const express = require('express')
// const bodyParser = require('body-parser');

const envelopesRawData = fs.readFileSync("envelopes.json");
const envelopesJSON = JSON.parse(envelopesRawData);

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_TOKEN); // get the token from envirenment variable

//this unite Express with webHook from Telegraf
app.use(bot.webhookCallback("/bot.js"));

//and this will set our webhook for our bot


//before app.get
// app.get("/", (req, res) => {
//   res.send("Our new tab!!");
// });



// const token = process.env.TELEGRAM_TOKEN;
// let bot;
 
// if (process.env.NODE_ENV === 'production') {
//    bot = new TelegramBot(token);
//    bot.setWebHook(process.env.HEROKU_URL + bot.token);
// } else {
//    bot = new TelegramBot(token, { polling: true });
// }

// const app = express();
 
// app.use(bodyParser.json());
 
// app.listen(process.env.PORT);
 
// app.post('/' + bot.token, (req, res) => {
//   bot.processUpdate(req.body);
//   res.sendStatus(200);
// });


// bot.onText("test", (msg, match) => bot.sendMessage("Test"));

 

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
  ctx.reply(`Here is the current ladder:\n${parseLadder()}`);
});

bot.command("newgame", (ctx) => {
  if (typeof ctx.from.username !== "undefined") {
    ctx.session.save = { player: ctx.from.username, level: 0 };
    saveGame(ctx.session.save);
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
      ctx.session.save = loadGame(ctx.from.username);
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
    saveGame(ctx.session.save);
    ctx.reply(
      `Congrats! Your answer is right. Here is the next clue:\n\n${
        envelopesJSON[ctx.session.save.level].clue
      }\n\n${envelopesJSON[ctx.session.save.level].task}`
    );
  } else if (ctx.message.text === "/endgame") {
    ctx.reply(
      "Leaving the current scavanger hunt. Your progress will be saved"
    );
    saveGame(ctx.session.save);
    ctx.scene.leave();
  } else if (ctx.message.text === "/newgame") {
    ctx.reply("Your scavanger hunt is already in progress.");
  } else if (ctx.message.text === "/ladder") {
    ctx.reply(`Here is the current ladder:\n${parseLadder(ladderJSON)}`);
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
    writePlayerToLadder(ctx.session.save.player);
    deleteGame(ctx.session.save.player);
    ctx.scene.leave();
  }
});

bot.telegram.setWebhook(`https://api.telegram.org/bot${proces.env.TELEGRAM_TOKEN}/setwebhook?url=${proces.env.HEROKU_URL}/bot.js`);
bot.telegram.setWebhook(process.env.HEROKU_URL);
bot.startWebhook('/', null, process.env.PORT);

// bot.launch();





function gameFound(player) {
  const savesRawData = fs.readFileSync("saves.json");
  var savesJSON = JSON.parse(savesRawData);
  var found = false;
  for (s of savesJSON) {
    if (s.player === player) {
      found = true;
      break;
    }
  }
  return found;
}

function writePlayerToLadder(player) {
  var ladderRawData = fs.readFileSync("ladder.json");
  var ladderJSON = JSON.parse(ladderRawData);
  for (l of ladderJSON) {
    if (l.player === player) break;
    if (l.player === "") {
      l.player = player;
      break;
    }
  }
  var ladder = JSON.stringify(ladderJSON);
  fs.writeFile(path.join(__dirname, "ladder.json"), ladder, (err) => {
    if (err) throw err;
    console.log(ladder);
    console.log("Ladder updated...");
  });
}

function parseLadder() {
  const ladderRawData = fs.readFileSync("ladder.json");
  const ladderJSON = JSON.parse(ladderRawData);
  ladderString = "";
  ladderJSON.forEach((l) => {
    ladderString += `Place ${l.place}: ${l.player}\n`;
  });
  return ladderString;
}

function saveGame(save) {
  var savesRawData = fs.readFileSync("saves.json");
  var savesJSON = JSON.parse(savesRawData);
  var found = false;
  for (s of savesJSON) {
    if (s.player === save.player) {
      s.level = save.level;
      found = true;
      break;
    }
  }
  if (!found) savesJSON.push(save);
  var saves = JSON.stringify(savesJSON);
  fs.writeFile(path.join(__dirname, "saves.json"), saves, (err) => {
    if (err) throw err;
    console.log(saves);
    console.log("Saves updated...");
  });
}

function loadGame(player) {
  const savesRawData = fs.readFileSync("saves.json");
  var savesJSON = JSON.parse(savesRawData);
  for (s of savesJSON) {
    if (s.player === player) {
      return s;
    }
  }
}

function deleteGame(player) {
  var savesRawData = fs.readFileSync("saves.json");
  var savesJSON = JSON.parse(savesRawData);
  for (let i = 0; i < savesJSON.length; i++) {
    if (savesJSON[i].player === player) savesJSON.splice(i, 1);
  }
  var saves = JSON.stringify(savesJSON);
  fs.writeFile(path.join(__dirname, "saves.json"), saves, (err) => {
    if (err) throw err;
    console.log(saves);
    console.log("Saves updated...");
  });
}
