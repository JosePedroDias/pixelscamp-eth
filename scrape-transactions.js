const fs = require('fs');
const http = require('http');
const https = require('http');
http.globalAgent.maxSockets = 100;
https.globalAgent.maxSockets = 100;

const scrapeIt = require('scrape-it');
const mapLimit = require('./mapLimit');

function getTransactionsPage(n) {
  console.log('#:%s', n);
  return scrapeIt(
    {
      url: 'http://moon.pixels.camp:8548/events/' + n,
    }, {
      transactions: {
        listItem: 'tr',
        data: {
          kind: 'td:nth-child(1)',
          url: {
            selector: 'td:nth-child(1) a',
            attr: 'href'
          },
          from: 'td:nth-child(2)',
          to: 'td:nth-child(3)',
          amount: {
            selector: 'td:nth-child(4)',
            convert: d => parseFloat(d.split(' ')[0])
          },
          date: 'td:nth-child(5)'
        }
      }
    }
  ).then(o => {
    o.transactions.splice(0, 1);
    console.log(o.transactions.length);
    return o;
  });
}


//getTransactionsPage('50')
//  .then(a => console.log(a))
//  .catch(err => console.error(err));

// 0 -> 12750
const pages = new Array(256).fill(0).map((_, i) => i * 50);
//console.log(pages.pop());
//const pages = [0, 50];


function onAll(all) {
  let all2 = [];
  all.forEach(o => {
    all2 = all2.concat(o.transactions);
  });
  fs.writeFileSync('transactions.json', JSON.stringify(all2));
}

mapLimit(pages, getTransactionsPage, 1)
  .then(onAll)
  .catch(err => console.error(err));