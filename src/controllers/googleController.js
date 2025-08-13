const { google } = require('googleapis');

class GoogleController {
     #email;
    #name;
    #auth;
    #sheets;

    constructor() {
        this.#email = "test-304@nomadic-armor-427708-d9.iam.gserviceaccount.com";
        this.#name = "test";
        this.#initializeAuth();
    }

    #initializeAuth() {
        // Get the private key from environment and properly format it
        const privateKey = process.env.GOOGLE_PRIVATE_KEY
            ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
            : null;

        if (!privateKey) {
            throw new Error('Google private key is not configured');
        }


        let au = new google.auth.GoogleAuth({
            credentials: {
                client_email: this.#email,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        // console.log(au)
        this.#auth = au;
    }

 
    get name() {
        return this.#name;
    }

  
    set name(newName) {
        if (newName && typeof newName === 'string') {
            this.#name = newName;
        }
    }

    async loadData(spreadsheetId, range) {

        console.log(1);
        
        try {
            if (!this.#sheets) {
                let sh = google.sheets({ version: 'v4', auth: this.#auth });
                console.log(sh)
                this.#sheets = sh
            }
console.log(spreadsheetId)
            const response = await this.#sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });
// console.log(response)
            const rows = response.data.values;
            if (!rows || rows.length === 0) {
                console.log('No data found in the sheet.');
                return [];
            }

            const headers = rows[0];
            const data = rows.slice(1).map(row => {
                const obj = {};
                headers.forEach((header, i) => {
                    obj[header] = row[i] || null;
                });
                return obj;
            });

            console.log(`Successfully loaded ${data.length} rows from Google Sheet`);
            return data;
        } catch (error) {
            console.error('Error loading Google Sheet data:', error.message);
            throw error;
        }
    }
}

module.exports = GoogleController;