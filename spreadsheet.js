const { GoogleSpreadsheet } = require("google-spreadsheet");
const { promisify } = require("util");

const creds = require("./client_secret.json");

const doc = new GoogleSpreadsheet("1D-1XjqAcbMPRGBpBseSOttQMc5A0d20CtpngjBGnLgI");

async function accessSpreadsheet() {
    
    await doc.useServiceAccountAuth(creds);

    await doc.loadInfo();

    console.log(doc.title);

    const sheet = doc.sheetsByIndex[0];

    const rows = await sheet.getRows({
        offset: 1
    });

    console.log(rows);

}

accessSpreadsheet();