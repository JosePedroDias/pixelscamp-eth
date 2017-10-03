'use strict';

fetch('data-for-browser.json')
  .then(resp => resp.json())
  .then(o => go(o.transactions, o.w2u, o.w2p, o.u2p, o.a2n));


function go(transactions, w2u, w2p, u2p, a2n) {
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
      return `Proj ${w2p[accNo].name}`;
    }
    if (isAngel(accNo)) {
      const u = w2u[accNo];
      return `Angel ${u && u.name || a2n[accNo]}`;
    }
    if (isUserWithProject(accNo)) {
      const u = w2u[accNo];
      const p = w2p[u2p[accNo]];
      return `User ${u.name} of proj ${p.name}`;
    }
    const u = w2u[accNo];
    if (u) {
      return `User ${u.name}`;
    }
    return `? ${accNo} ?`;
  }


  const W = 1000;
  const H = 800;
  const M = 50;
  //console.log(a2n);
  const s = Snap(W, H);

  function rndN(n) {
    return Math.random() * n;
  }
  function rndNMargin(n, m) {
    return m / 2 + rndN(n - m);
  }

  const wallets = Object.keys(
    transactions.reduce(
      (prev, t) => {
        prev[t.f] = true;
        prev[t.t] = true;
        return prev;
      },
      {}
    )
  );
  //console.log(wallets);

  const PROJ_CLR = 'purple';
  const ANGEL_CLR = 'cyan';
  const USR_CLR = 'orange';
  const OTH_CLR = 'gray';

  wallets.forEach(w => {
    const c = s.circle(rndNMargin(W, M), rndNMargin(H, M), 10);
    const name = getName(w);
    const n = name[0];
    let clr = (n === 'A' ? ANGEL_CLR : (n === 'P' ? PROJ_CLR : (w in w2u ? USR_CLR : OTH_CLR)));
    c.attr({
      id: w,
      fill: clr,
      title: name
    });
  });
}