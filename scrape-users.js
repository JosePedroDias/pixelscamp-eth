const fs = require('fs');
const http = require('http');
const https = require('http');
http.globalAgent.maxSockets = 100;
https.globalAgent.maxSockets = 100;

const req = require('tinyreq');
const mapLimit = require('./mapLimit');



const users = require('./users.json');



let skipped = 0;

function getUser(login) {
  return req({
    url: 'https://api.pixels.camp/users/' + login
  }).then(s => {
    const o = JSON.parse(s);
    const o2 = {
      login: login,
      name: o.name,
      company: o.company,
      wallet: o.wallet
    };
    console.log(o2);
    return o2;
  }).catch(err => {
    ++skipped;
    console.error(login + ' failed');
    return {};
  })
}

// getUser('JosePedroDias').then(a => console.log(a));

function onceAll(arr) {
  console.log('SKIPPED', skipped);
  console.log('ALL', arr.length);
  const arr2 = arr.filter(o => 'name' in o);
  console.log('WITH NAME', arr2.length);
  const arr3 = arr2.filter(o => 'wallet' in o && o.wallet);
  console.log('WITH WALLET', arr3.length);
  fs.writeFileSync('users-with-wallet.json', JSON.stringify(arr3));
}

mapLimit(users, getUser, 2).then(onceAll);
