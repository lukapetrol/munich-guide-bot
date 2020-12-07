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


 

module.exports = { gameFound, saveGame, loadGame, deleteGame, parseLadder, addPlayerToLadder, setPenalty, checkPenalty, removePenalty, getRemainingPenaltyTime };