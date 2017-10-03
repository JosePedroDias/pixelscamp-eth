const fs = require('fs');
const http = require('http');
const https = require('http');
http.globalAgent.maxSockets = 100;
https.globalAgent.maxSockets = 100;

const req = require('tinyreq');
const mapLimit = require('./mapLimit');



const projects = require('./projects.json');



let skipped = 0;

function getProject(project) {
  return req({
    url: 'https://api.pixels.camp/projects/' + project[1]
  }).then(s => {
    const o = JSON.parse(s);
    const o2 = {
      id: o.id,
      users: o.users.map(u => u.user),
      name: o.name,
      wallet: o.wallet
    };
    console.log(o2);
    return o2;
  }).catch(err => {
    ++skipped;
    console.error(project + ' failed');
    return {};
  })
}


//getProject([0, 6]).then(a => console.log(a));


function onceAll(arr) {
  console.log('SKIPPED', skipped);
  console.log('ALL', arr.length);
  const arr2 = arr.filter(o => 'name' in o);
  console.log('WITH NAME', arr2.length);
  const arr3 = arr2.filter(o => 'wallet' in o && o.wallet);
  console.log('WITH WALLET', arr3.length);
  fs.writeFileSync('projects-with-wallet.json', JSON.stringify(arr3));
}

mapLimit(projects, getProject, 2).then(onceAll);
