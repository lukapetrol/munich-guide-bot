require("dotenv").config();
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

const doc = new GoogleSpreadsheet("15xbstTjUU1-xa6GYPZue57UKHbGsbFG2qyWiDhi-IB0");


async function gameFound(playerName) {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows({
        offset: 0
    });
    var playerFound = false;
    for(row of rows) {
        if(row._rawData[0] === playerName) playerFound = true;
    }
    return playerFound;
}

async function saveGame(playerName, playerLevel, penaltyCount) {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows({
        offset: 0
    });
    var playerFound = false;
    for(row of rows) {
        if(row._rawData[0] === playerName) {
            row.Level = playerLevel;
            row.PenaltyCount = penaltyCount;
            await row.save();
            playerFound = true;
        }
    }
    if(!playerFound) await sheet.addRow({ "Player": playerName, "Level": playerLevel, "PenaltyCount": penaltyCount });
}

async function loadGame(playerName) {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    var game = null;
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows({
        offset: 0
    });
    rows.forEach(row => {
        if(row._rawData[0] === playerName) game = { player: row._rawData[0], level: row._rawData[1], penaltyCount: row._rawData[2] };
    });
    return game;
}

async function deleteGame(playerName) {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows({
        offset: 0
    });
    rows.forEach(row => {
        if(row._rawData[0] === playerName) row.delete();
    });
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

async function addPlayerToLadder(playerName) {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[1];
    const rows = await sheet.getRows({
        offset: 0
    });
    for(row of rows) {
        if(row._rawData[1] === playerName) {
            break;
        } else if(typeof row._rawData[1] === "undefined") {
            row._rawData[1] = playerName;
            await row.save();
            break;
        }
    }
}

async function setPenalty(playerName) {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[2];
    const rows = await sheet.getRows({
        offset: 0
    });
    var date = new Date();
    var playerFound = false;
    for(row of rows) {
        if(row._rawData[0] === playerName) {
            row._rawData[1] = date;
            await row.save();
            playerFound = true;
            break;
        }
    }
    if(!playerFound) await sheet.addRow({ "Player": playerName, "Time": date });
}

async function checkPenalty(playerName) {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[2];
    const rows = await sheet.getRows({
        offset: 0
    });
    var penaltyActive = false;
    var currentDate = new Date();
    for(row of rows) {
        if(row._rawData[0] === playerName) {
            var penaltyDate = new Date(row._rawData[1]);
            var difference = (currentDate.getTime() - penaltyDate.getTime()) / 1000;
            if(difference < 1800) {
                penaltyActive = true;
            } else {
                penaltyActive = false;
                removePenalty(playerName);
            }
            break;
        }
    }
    return penaltyActive;
}

async function removePenalty(playerName) {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[2];
    const rows = await sheet.getRows({
        offset: 0
    });
}

async function getRemainingPenaltyTime(playerName) {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[2];
    const rows = await sheet.getRows({
        offset: 0
    });
    var penaltyFound = false;
    var currentDate = new Date();
    for(row of rows) {
        if(row._rawData[0] === playerName) {
            penaltyFound = true;
            var penaltyDate = new Date(row._rawData[1]);
            var difference = Math.floor((currentDate.getTime() - penaltyDate.getTime()) / 1000);
            var pendingTime = 1800 - difference;
            break;
        }
    }
    if(penaltyFound) {
        var minutes = Math.floor(pendingTime / 60);
        var seconds = pendingTime % 60;
        return `${minutes} minutes and ${seconds} seconds`;
    } else {
        return "no penalty time";
    }
} 

module.exports = { gameFound, saveGame, loadGame, deleteGame, parseLadder, addPlayerToLadder, setPenalty, checkPenalty, removePenalty, getRemainingPenaltyTime };