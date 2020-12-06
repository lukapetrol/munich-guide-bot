require("dotenv").config();
const Telegraf = require("telegraf");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const fs = require("fs");

const envelopesRawData = fs.readFileSync("envelopes.json");
const envelopesJSON = JSON.parse(envelopesRawData);

let Data = require("./data.js");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// bot.telegram.setWebhook(
//   `${process.env.HEROKU_URL}/bot${process.env.TELEGRAM_TOKEN}`
// );
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


const { GoogleSpreadsheet } = require("google-spreadsheet");


const creds = {
    "type": process.env.GOOGLE_ACCOUNT_TYPE,
    "project_id": process.env.GOOGLE_PROJECT_ID,
    "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
    "private_key": process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.GOOGLE_CLIENT_EMAIL,
    "client_id": process.env.GOOGLE_CLIENT_ID,
    "auth_uri": process.env.GOOGLE_AUTH_URI,
    "token_uri": process.env.GOOGLE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
    "client_x509_cert_url": process.env.GOOGLE_CLIENT_CERT_URL
}

async function parseLadder() {
  const doc = new GoogleSpreadsheet("15xbstTjUU1-xa6GYPZue57UKHbGsbFG2qyWiDhi-IB0");
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[1];
  const rows = await sheet.getRows({
      offset: 0
  });
  var ladderString = "";
  for(row of rows) {
      if(typeof row._rawData[1] === "undefined") {
          ladderString += `Place ${row._rawData[0]}: \n`;
      } else {
          ladderString += `Place ${row._rawData[0]}: ${row._rawData[1]}\n`;
      }
  }
  return ladderString;
}



const game = new Scene("game");
stage.register(game);

const existingGame = new Scene("existingGame");
stage.register(existingGame);

const startMessage = `
Greetings traveller! You just arrived in Munich a few days or weeks ago I assume. The city can seem big and scary at first. But do not worry! With some navigational skills as well as some simple math I will guide you through the historical core of the city on this years inner city Scavenger Hunt.
To start the Scavenger Hunt enter /newgame .
For all available commands enter /help .
Please make sure you have registerd a Telegram-Username to be able to participate in the Scavenger Hunt.`;

bot.start((ctx) => ctx.reply(startMessage));

bot.command("help", (ctx) => {
  ctx.reply(`Here is a list of all available commands:
/help - List all commands
/newgame - Start a new Scavenger Hunt.
/resumegame - Resume an your Scavenger Hunt.
/endgame - End your current Scavenger Hunt.
/ladder - Show the first ten players to finish the Scavenger Hunt.
/clue - Shows the last clue.
/showprogress - Shows how far you have gotten on your Scavenger Hunt.
/info - Shows interesting facts about your curret station.`);
});

bot.command("ladder", (ctx) => {
  parseLadder().then(ladder => {
    ctx.reply(`Here is the current ladder:\n${ladder}`);
  });
});

bot.command("newgame", (ctx) => {
  if (typeof ctx.from.username !== "undefined") {

    Data.gameFound(ctx.from.username).then(found => {

      if(!found) {
        ctx.session.save = { player: ctx.from.username, level: 0, penaltyCount: 0 };
        Data.saveGame(ctx.session.save.player, ctx.session.save.level, ctx.session.save.penaltyCount);
        ctx.reply("Starting new game. Get ready for your first clue.");
        ctx.scene.enter("game");
      } else {
        ctx.reply(
          'It seems like you haven\'t finished an existing Scavenger Hunt.\nEnter "resume" to resume your existing Scavenger Hunt.\nEnter "new" to start a new Scavenger Hunt. Your old progress will be lost.'
        );
        ctx.scene.enter("existingGame");
      }

    });
  } else {
    ctx.reply(
      'It appears that you haven\'t registered a Telegram-Username. Please enter your Username under "Telegram > Settings" before participating in the Scavenger Hunt.'
    );
  }
});

bot.command("resumegame", (ctx) => {
  if (typeof ctx.from.username !== undefined) {
    Data.gameFound(ctx.from.username).then(found => {
      if(found) {
        Data.loadGame(ctx.from.username).then(game => {
          ctx.session.save = game;
          ctx.reply(
            `Game found. Your Scavenger Hunt will be resumed. Here is your last clue:`
          );
          ctx.scene.leave();
          ctx.scene.enter("game");
        });
      } else {
        ctx.reply(
          "A game with your registered Telegram-Username could not be found. Please start a new game by entering /newgame."
        );
      }
    });
  } else {
    ctx.reply(
      'It appears that you haven\'t registered a Telegram-Username. Please enter your Username under "Telegram > Settings" before participating in the Scavenger Hunt.'
    );
  }
});

bot.command("clue", (ctx) => {
  ctx.reply("Please enter a game by using /newgame or /resumegame.");
});

bot.command("showprogress", (ctx) => {
  Data.loadGame(ctx.from.username).then(game => {
    var progressLevel = game.level;
    ctx.reply(`You have completed ${progressLevel} out of 20 stations.`);
  });
});

bot.command("info", (ctx) => {
  ctx.reply("Please enter a game before using this command.");
});

existingGame.on("text", (ctx) => {
  if (ctx.message.text === "resume") {
    Data.loadGame(ctx.from.username).then(game => {
      ctx.session.save = game;
      ctx.reply(
        "Your old Scavenger Hunt will be resumed.\nHere is your last clue:"
      );
      ctx.scene.leave();
      ctx.scene.enter("game");
    });
  } else if (ctx.message.text === "new") {
    Data.loadGame(ctx.from.username).then(game => {
      ctx.session.save = { player: ctx.from.username, level: 0, penaltyCount: game.penaltyCount };
      Data.saveGame(ctx.session.save.player, ctx.session.save.level, ctx.session.save.penaltyCount);
      ctx.reply(
        "You have started a new Scavenger Hunt.\nYour old progress will be lost.\nHere is your first clue:"
      );
      ctx.scene.leave();
      ctx.scene.enter("game");
    }); 
  }
});

game.enter((ctx) => {
  console.log(ctx.session.save);
  ctx.reply(
    `${envelopesJSON[ctx.session.save.level].clue}\n\n${
      envelopesJSON[ctx.session.save.level].task
    }`
  );
});

game.on("text", (ctx) => {
  if (ctx.message.text === String(envelopeOrder[ctx.session.save.level])) {
    Data.checkPenalty(ctx.from.username).then(active => {
      if(!active) {
        if(ctx.session.save.penaltyCount > 2) ctx.session.save.penaltyCount = 0;
        ctx.session.save.level++;
        console.log(ctx.session.save);
        Data.saveGame(ctx.session.save.player, ctx.session.save.level, ctx.session.save.penaltyCount);
        ctx.reply(
          `Congrats! Your answer is right.\nUse /info to learn more about your current station.\nHere is the next clue:\n\n${
            envelopesJSON[ctx.session.save.level].clue
          }\n\n${envelopesJSON[ctx.session.save.level].task}`
        );
      } else {
        Data.getRemainingPenaltyTime(time => {
          ctx.reply(`Your penalty is still pending. Please wait ${time}.`);
        });
      }
    });
  } else if (ctx.message.text === "/endgame") {
    ctx.reply(
      "Leaving the current Scavenger Hunt. Your progress will be saved"
    );
    Data.saveGame(ctx.session.save.player, ctx.session.save.level, ctx.session.save.penaltyCount);
    ctx.scene.leave();
  } else if (ctx.message.text === "/newgame") {
    ctx.reply("Your Scavenger Hunt is already in progress.");
  } else if (ctx.message.text === "/ladder") {
    Data.parseLadder().then(ladder => {
      ctx.reply(`Here is the current ladder:\n${ladder}`);
    });
  } else if (ctx.message.text === "/help") {
    ctx.reply(`Here is a list of all available commands:
/help - List all commands
/newgame - Start a new Scavenger Hunt.
/resumegame - Resume an your Scavenger Hunt.
/endgame - End your current Scavenger Hunt.
/ladder - Show the first ten players to finish the Scavenger Hunt.
/clue - Shows the last clue.
/showprogress - Shows how far you have gotten on your Scavenger Hunt.
/info - Shows interesting facts about your curret station.`);
  } else if (ctx.message.text === "/clue") {
    ctx.reply(
      `Here is your last clue:\n\n${
        envelopesJSON[ctx.session.save.level].clue
      }\n\n${envelopesJSON[ctx.session.save.level].task}`
    );
  } else if (ctx.message.text === "/showprogress") {
    let progressLevel = ctx.session.save.level;
    ctx.reply(`You have completed ${progressLevel} out of 20 stations.`);
  } else if (ctx.message.text === "/info") {
    if (ctx.session.save.level > 0)
      ctx.reply(envelopesJSON[ctx.session.save.level - 1].info);
  } else {
    Data.checkPenalty(ctx.from.username).then(active => {
      if(!active) {
        ctx.reply("Your number is incorrect. Try again.");
        ctx.session.save.penaltyCount++;
        Data.saveGame(ctx.session.save.player, ctx.session.save.level, ctx.session.save.penaltyCount);
        if(ctx.session.save.penaltyCount > 2) {
          Data.setPenalty(ctx.from.username);
          ctx.session.save.penaltyCount = 0;
          Data.saveGame(ctx.session.save.player, ctx.session.save.level, ctx.session.save.penaltyCount);
        }
      } else {
        Data.getRemainingPenaltyTime(ctx.from.username).then(time => {
          ctx.reply(`Your penalty is still pending. Please wait ${time}.`);
        });
      }
    });
  }


  if (ctx.session.save.level === 20) {
    ctx.reply(
      "Congratulations! You have sucessfully finished the Scavenger Hunt."
    );
    Data.addPlayerToLadder(ctx.session.save.player);
    Data.deleteGame(ctx.session.save.player);
    ctx.scene.leave();
  }
});

bot.launch();
