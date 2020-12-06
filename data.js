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



const creds2 = require("./client_secret.json");

function test() {
    var credKeys = Object.keys(creds1);
    for(key of credKeys) {
        if(creds1[key] !== creds2[key]) {
            console.log(creds1[key]);
            console.log(creds2[key]);
        }
    }
}

const doc = new GoogleSpreadsheet("15xbstTjUU1-xa6GYPZue57UKHbGsbFG2qyWiDhi-IB0");

// "type": "service_account",
// "project_id": "testnode-296622",
// "private_key_id": "7160c22c114ef56d518518a774f9931453d54de4",
// "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCoc6hbYND70Nye\n6Em5nzkaCPW7QQSsi46TVH6y6POyaIhsXWBnP3zcGWnGZsG0OULJ5RE9Xdu1uXV2\nYWHcbzAVCLDOSloLLCtsf7ren/g8zsKg/GZE+k3Edn0qzejb/IJVxu7l1/OZpTUu\n4pyaqF1QxnCyb90zHHKHIVWj0x4h9pfogMiBQdca57NmkPaoRl9hYzLzRk8cOCcF\nEbyDz9wRpMALHkcVo4/aY13n3nDem8J53DhhyHrXu/mfWXw/mnJqOIKpaWs8O67Y\nosYYr0UhLRubg7eu2AePtnRHJwKLetAVfCH+hYVQcSQDv4eto4G91lhfd3LNjvFC\ndXG83kZFAgMBAAECggEAFi4IXw5xOz7l1bc7LImLq2MToUtvJ0hG28ehLm3K11UO\nkB9+t97dp14MleGQzr9IDS0FUexfp16whIelADEpsRNQXbvffZ9xZkYD38Kgx7eS\nW+pv4tQxqip50kmDcs0dh4LRO4qYL2+tKtZkDV8ZeQRv8VFrsYpPhX28+NGtottO\nWoqOwJctSfXRHakIuNgy3HGQRXArr44fKS6AKugxiiGwuggLTiRtXfC4aFMxKdAI\ndrPwTPgnf81wVpku2+dyHPprLIq/RmO3w4vXsEFgeNxVNYMDpqMhKoiL5H5yAoPu\nrdDOZ8SkZIWaD3xGR9Ckj25IfaCHnz5KnojAd0Kk/wKBgQDWfW6XugmEti3R19Re\nzVTepOY+OGAu4ZCi6MQqhaomGBgRVDzsrDUpYV/IHxuSaTayAaYiHCk/ocGZQyJq\n0KIPDcoWMWlbjJd5MMTLFjKm4SsM/KDY//zikjSrbcIozwbBJac9YhOnB783k8VN\nANWGXHs7dZLz4fTkvpvrmCwMGwKBgQDJDVYebgii0PAKYn56skR+orb+JPCVsC9p\n056TOMNgdJnI2qpPq/8ox48tTmM1aXKz78qQffxAp+9it7ZARRYkuMiB6L3Q0/Lr\nyE38T+kLLfiwsfSSOOCokVSZZ+IynTsRSv5G0OTzd1YcuPe6sxYcU/xavzYWRbop\nkGSIaZldHwKBgQDVUlLXnDMzRm0zstCIqParqJ1FbJRcjAJpw86169JZqMTnFzyw\ntmT5DttQEYA+kV3QlEtCyXdMzffaEib8zRsglbpTcDk00BMmeRaAVUdzKabDd84R\nhCdiv76acMMWCzDQkD5QkmaxTMck41brStUSmJAHhtvsquIBToGMQwAr2QKBgAkt\nwrDA9UP5pfvTY1LWsKnXY+NWbGVpFcEPGD5AaSsOJ7czxHK+t3d1JOQ8n+rgVYxB\ndk4CcnHBOPyYxolIniovBXho18Gg64Y4LtdGDq2j+6aVeUTzs83+VI5sX7dP1lKD\nyfgRsWIsIJJPH4A2jNveObcq451Asa8UGILhz06hAoGAUPNSaPQXeR4mI96TTLjE\nZ0rrT6+PlrKUMw+qq8VX/mlOZx41c9/u5ZmHQBWczS+Nal3vazmQYYNGlRhSbIwp\nRpEDOiVvfd+qVPgLgjzY/ryF23FXcLUsKZts/8jRNUZA7IU4fYLRdA34ruA9V/ti\n1HlV3KyyehiACq5Z9lizU1Y=\n-----END PRIVATE KEY-----\n",
// "client_email": "munich-guide-bot@testnode-296622.iam.gserviceaccount.com",
// "client_id": "100396051393634173307",
// "auth_uri": "https://accounts.google.com/o/oauth2/auth",
// "token_uri": "https://oauth2.googleapis.com/token",
// "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
// "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/munich-guide-bot%40testnode-296622.iam.gserviceaccount.com"

// GOOGLE_ACCOUNT_TYPE=service_account
// GOOGLE_PROJECT_ID=testnode-296622
// GOOGLE_PRIVATE_KEY_ID=7160c22c114ef56d518518a774f9931453d54de4
// GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCoc6hbYND70Nye\n6Em5nzkaCPW7QQSsi46TVH6y6POyaIhsXWBnP3zcGWnGZsG0OULJ5RE9Xdu1uXV2\nYWHcbzAVCLDOSloLLCtsf7ren/g8zsKg/GZE+k3Edn0qzejb/IJVxu7l1/OZpTUu\n4pyaqF1QxnCyb90zHHKHIVWj0x4h9pfogMiBQdca57NmkPaoRl9hYzLzRk8cOCcF\nEbyDz9wRpMALHkcVo4/aY13n3nDem8J53DhhyHrXu/mfWXw/mnJqOIKpaWs8O67Y\nosYYr0UhLRubg7eu2AePtnRHJwKLetAVfCH+hYVQcSQDv4eto4G91lhfd3LNjvFC\ndXG83kZFAgMBAAECggEAFi4IXw5xOz7l1bc7LImLq2MToUtvJ0hG28ehLm3K11UO\nkB9+t97dp14MleGQzr9IDS0FUexfp16whIelADEpsRNQXbvffZ9xZkYD38Kgx7eS\nW+pv4tQxqip50kmDcs0dh4LRO4qYL2+tKtZkDV8ZeQRv8VFrsYpPhX28+NGtottO\nWoqOwJctSfXRHakIuNgy3HGQRXArr44fKS6AKugxiiGwuggLTiRtXfC4aFMxKdAI\ndrPwTPgnf81wVpku2+dyHPprLIq/RmO3w4vXsEFgeNxVNYMDpqMhKoiL5H5yAoPu\nrdDOZ8SkZIWaD3xGR9Ckj25IfaCHnz5KnojAd0Kk/wKBgQDWfW6XugmEti3R19Re\nzVTepOY+OGAu4ZCi6MQqhaomGBgRVDzsrDUpYV/IHxuSaTayAaYiHCk/ocGZQyJq\n0KIPDcoWMWlbjJd5MMTLFjKm4SsM/KDY//zikjSrbcIozwbBJac9YhOnB783k8VN\nANWGXHs7dZLz4fTkvpvrmCwMGwKBgQDJDVYebgii0PAKYn56skR+orb+JPCVsC9p\n056TOMNgdJnI2qpPq/8ox48tTmM1aXKz78qQffxAp+9it7ZARRYkuMiB6L3Q0/Lr\nyE38T+kLLfiwsfSSOOCokVSZZ+IynTsRSv5G0OTzd1YcuPe6sxYcU/xavzYWRbop\nkGSIaZldHwKBgQDVUlLXnDMzRm0zstCIqParqJ1FbJRcjAJpw86169JZqMTnFzyw\ntmT5DttQEYA+kV3QlEtCyXdMzffaEib8zRsglbpTcDk00BMmeRaAVUdzKabDd84R\nhCdiv76acMMWCzDQkD5QkmaxTMck41brStUSmJAHhtvsquIBToGMQwAr2QKBgAkt\nwrDA9UP5pfvTY1LWsKnXY+NWbGVpFcEPGD5AaSsOJ7czxHK+t3d1JOQ8n+rgVYxB\ndk4CcnHBOPyYxolIniovBXho18Gg64Y4LtdGDq2j+6aVeUTzs83+VI5sX7dP1lKD\nyfgRsWIsIJJPH4A2jNveObcq451Asa8UGILhz06hAoGAUPNSaPQXeR4mI96TTLjE\nZ0rrT6+PlrKUMw+qq8VX/mlOZx41c9/u5ZmHQBWczS+Nal3vazmQYYNGlRhSbIwp\nRpEDOiVvfd+qVPgLgjzY/ryF23FXcLUsKZts/8jRNUZA7IU4fYLRdA34ruA9V/ti\n1HlV3KyyehiACq5Z9lizU1Y=\n-----END PRIVATE KEY-----\n
// GOOGLE_CLIENT_EMAIL=munich-guide-bot@testnode-296622.iam.gserviceaccount.com
// GOOGLE_CLIENT_ID=100396051393634173307
// GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
// GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
// GOOGLE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
// GOOGLE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/munich-guide-bot%40testnode-296622.iam.gserviceaccount.com


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
    const creds = require("./client_secret.json");
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
            console.log(difference);
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

module.exports = { test, gameFound, saveGame, loadGame, deleteGame, parseLadder, addPlayerToLadder, setPenalty, checkPenalty, removePenalty, getRemainingPenaltyTime };