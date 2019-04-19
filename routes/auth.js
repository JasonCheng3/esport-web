var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const btoa = require('btoa');

/* release version
const CLIENT_ID = '536514791905427456';
const CLIENT_SECRET = 'wvwW1W4WIdsO2JgTZ27JHChfyO4XdKIg';
const redirect = encodeURIComponent('http://sesports.appspot.com/auth/callback');
*/
/* dev version */
const CLIENT_ID = '548028856024432640';
const CLIENT_SECRET = 'oDZ12m3-Ui-UHkdf__VKIO25t5rzia7c';
const redirect = encodeURIComponent('http://localhost:3000/auth/callback');


const URL_DISCORD_USER = 'http://discordapp.com/api/users/@me';

const { catchAsync } = require('../utils');

router.get('/', (req, res) => {
  res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

router.get('/callback', catchAsync(async (req, res) => {
  if (!req.query.code) throw new Error('NoCodeProvided');
  const code = req.query.code;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const fetchDiscordAuth = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
      },
    });
  const jsonDiscordAuth = await fetchDiscordAuth.json();
  console.log(jsonDiscordAuth);
  req.session.token = `${jsonDiscordAuth.access_token}`;

  const fetchDiscordUserInfo = await fetch(URL_DISCORD_USER, {
    headers: {
      Authorization: `Bearer ${jsonDiscordAuth.access_token}`,
    }
  });
  const jsonDiscordUserInfo = await fetchDiscordUserInfo.json();
  // console.log(jsonDiscordUserInfo);
  req.session.userid = `${jsonDiscordUserInfo.id}`;
  req.session.username = `${jsonDiscordUserInfo.username}`;

  // 確認session token
  if (req.session.hasOwnProperty('token')) {
    res.redirect(`/token/` + req.session.token);
  } else {
    console.error("no token");
  }

}));

module.exports = router;
