const { google } = require('googleapis');
const readline = require('readline');

const oAuth2Client = new google.auth.OAuth2(
  '1073501137899-bcs8vjpe9vg8a2b66slnfc09vn17qlvk.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground' // Redirect URI
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Authorize this app by visiting this URL:\n', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\nEnter the code from that page here: ', async (code) => {
  const { tokens } = await oAuth2Client.getToken(code);
  console.log('\nYour refresh token is:\n', tokens.refresh_token);
  rl.close();
});
