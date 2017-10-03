const projectsWithWallet = require('./projects-with-wallet.json');
const w2p = {}; // accNo/wallet 2 project
projectsWithWallet.forEach(o => {
  w2p[o.wallet.toLowerCase()] = o;
});
//console.log(w2p);



const angels = require('./angels.json');
const a2n = {}; // accno/angel 2 name
angels.forEach(o => {
  a2n[o[1].substring(2).toLowerCase()] = o[0];
});
//console.log(a2p);



const usersWithWallet = require('./users-with-wallet.json');
const w2u = {}; // accno/wallet to user
const un2w = {}; // username to accno/wallet
usersWithWallet.forEach(u => {
  u.rcvdEth = 0;
  u.sentUsers = 0;
  u.sentProjects = 0;
  u.nrTransRcvd = 0;
  u.nrTransProj = 0;
  u.nrTransUser = 0;
  u.nrTransOther = 0;
  const wallet = u.wallet.substring(2).toLowerCase();
  w2u[wallet] = u;
  un2w[u.login.toLowerCase()] = wallet;
});
const u2p = {}; // user wallet to its project wallet
projectsWithWallet.forEach(p => {
  p.users.forEach(username => {
    u2p[un2w[username.toLowerCase()]] = p.wallet.toLowerCase();
  });
});
//console.log(u2p);


const transactions0 = require('./transactions.json').slice(1322); // the slice removes transaction since bankrupcy started
const transactions = transactions0.map((t, i) => {
  return {
    f: (t.from).substring(2).toLowerCase(),
    t: (t.to).substring(2).toLowerCase(),
    a: t.amount,
    i: i
  };
});
//console.log(transactions.length);



function isAngel(accNo) {
  return accNo in a2n;
}

function isUserWithProject(accNo) {
  return accNo in u2p;
}

function isProject(accNo) {
  return accNo in w2p;
}

function getName(accNo) {
  if (isProject(accNo)) {
    return `Project ${w2p[accNo].name}`;
  }
  if (isAngel(accNo)) {
    return `Angel ${w2u[accNo].name}`;
  }
  if (isUserWithProject(accNo)) {
    const u = w2u[accNo];
    const p = w2p[u2p[accNo]];
    return `User ${u.name} of project ${p.name}`;
  }
  const u = w2u[accNo];
  if (u) {
    return `User ${u.name}`;
  }
  return `? ${accNo} ?`;
}




const SUSKIND = '48e6f88f863c3178f470d92f799c6959fe98e2fe';
const AMNO = '2aaad4391e6fa365c0346503da24b00bdfa3ceb9';
const JOSEPEDRODIAS = '21eea2ca122f3cce2d5f1ae6482f5d6109f0193e';
const CANIAGREE = '6720f8fc5383c838ec1b52812bc83fed5d315b85';

/*
console.log('isAngel SUSKIND', isAngel(SUSKIND));
console.log('isAngel AMNO', isAngel(AMNO));
console.log('isAngel JOSEPEDRODIAS', isAngel(JOSEPEDRODIAS));
console.log('isAngel CANIAGREE', isAngel(CANIAGREE));

console.log('isUserWithProject SUSKIND', isUserWithProject(SUSKIND));
console.log('isUserWithProject AMNO', isUserWithProject(AMNO));
console.log('isUserWithProject JOSEPEDRODIAS', isUserWithProject(JOSEPEDRODIAS));
console.log('isUserWithProject CANIAGREE', isUserWithProject(CANIAGREE));

console.log('isProject SUSKIND', isProject(SUSKIND));
console.log('isProject AMNO', isProject(AMNO));
console.log('isProject JOSEPEDRODIAS', isProject(JOSEPEDRODIAS));
console.log('isProject CANIAGREE', isProject(CANIAGREE));

console.log('getName SUSKIND', getName(SUSKIND));
console.log('getName AMNO', getName(AMNO));
console.log('getName JOSEPEDRODIAS', getName(JOSEPEDRODIAS));
console.log('getName CANIAGREE', getName(CANIAGREE));
*/



function transOfAccNo(accNo) {
  return transactions.filter(t => {
    return t.f === accNo || t.t === accNo;
  });
}

function simplifyTransOfAccNo(accNo) {
  return transOfAccNo(accNo).map(t => {
    return t.t === accNo ? t.a : -t.a;
  });
}

//console.log(simplifyTransOfAccNo(CANIAGREE));



// when did projects get bankrupt?

const projData = projectsWithWallet.map(p => {
  const w = p.wallet.toLowerCase();
  //console.log('----\n' + p.name);
  const trans = transOfAccNo(w);

  const eth = trans.reduce(
    function (acc, t) {
      return acc + t.a;
    },
    0
  );
  //console.log('$:', eth);

  //const cutT = trans.find(t => t.f === w);
  //console.log(cutT);
  //console.log('$:', cutT.a);
  //console.log('idx:', cutT.i);

  //console.log('# trans:', trans.length);

  return {
    name: p.name,
    eth: eth,
    nrTrans: trans.length
  };

  // 1266 - 1322
});

function sigma(n) { return n < 0 ? -1 : (n > 0) ? 1 : 0; }
function getEth(p) { return p.eth; }
projData.sort(function (p1, p2) { return sigma(getEth(p1) - getEth(p2)); });
//console.log(projData);



// users with most transactions and eth

transactions.forEach(t => {
  const u1 = w2u[t.f];
  const u2 = w2u[t.t];

  if (!u1) {
    //++u1.nrTransUser;
  }

  if (u2) {
    if (u1) {
      ++u1.nrTransUser;
      u1.sentUsers += t.a;
    }
    ++u2.nrTransRcvd;
    u2.rcvdEth += t.a;
  } else if (isProject(t.t) && u1) {
    ++u1.nrTransProj;
    u1.sentProjects += t.a;
  } else if (u1) {
    ++u1.nrTransOther;
  }
});

const users = Object.values(w2u);
function getV(u) { return u.sentProjects; } // sentProjects rcvdEth
users.sort(function (u1, u2) { return sigma(getV(u1) - getV(u2)); })
console.log(users.reverse().splice(0, 10));