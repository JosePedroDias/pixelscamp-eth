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
    if (accNo === '3d417b8305aa60688385a1ca56530130c77f8739') { return 'PIXELSCAMP'; }
    if (accNo === '3aaec243e4d22484061b7123d0686136d9edddb1') { return 'APPLY_BANKRUPCY'; }
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
  const H = 600;
  const M = 50;
  //console.log(a2n);
  const s = Snap(W, H);

  function rndN(n) {
    return ~~(Math.random() * n);
  }
  function rndNMargin(n, m) {
    return m / 2 + rndN(n - m);
  }

  transactions.reverse(); // oldest to newest

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

  const nodes = {};
  window.nodes = nodes;

  const SCL = 0.3;
  const DUR = 1;
  const MIN_R = 1;//0.01;

  wallets.forEach(w => {
    const cx = rndNMargin(W, M);
    const cy = rndNMargin(H, M);
    //console.log(cx, cy);
    const c = s.circle(cx, cy, MIN_R);
    const name = getName(w);
    const n = name[0];
    let clr = (n === 'A' ? ANGEL_CLR : (n === 'P' ? PROJ_CLR : (w in w2u ? USR_CLR : OTH_CLR)));
    //if (clr === OTH_CLR) { console.log('account: %s', w); }
    c.attr({
      id: w,
      fill: clr,
      dataTitle: name,
      dataEth: 0
    });
    nodes[w] = c;
  });

  let trIdx = -1;

  function renderTransaction(tr, toTheFuture) {
    const n0 = nodes[tr.f];
    const n1 = nodes[tr.t];
    const a = (toTheFuture ? 1 : -1) * SCL * tr.a;

    //window.n0 = n0;
    //window.n1 = n1;

    console.log(
      '#' + trIdx,
      (trIdx / transactions.length * 100).toFixed(1) + '%',
      n0.attr('dataTitle'),
      (toTheFuture ? '<-' : '--'),
      tr.a,
      (toTheFuture ? '--' : '->'),
      n1.attr('dataTitle')
    );

    let e = parseFloat(n0.attr('dataEth'));
    e += a;
    n0.attr({ dataEth: e });
    let r = Math.sqrt(e / Math.PI);
    if (r < MIN_R || isNaN(r)) { r = MIN_R; }
    r = Math.max(r, MIN_R);
    n0.attr({ r: r }, DUR);

    e = parseFloat(n1.attr('dataEth'));
    e -= a;
    n1.attr({ dataEth: e });
    r = Math.sqrt(e / Math.PI);
    if (r < MIN_R || isNaN(r)) { r = MIN_R; }
    n1.attr({ r: r }, DUR);

    /*
    const l = s.line(
      n0.attr('cx'), n0.attr('cy'),
      n1.attr('cx'), n1.attr('cy'),
    ).attr({ stroke: '#000', strokeWidth: 0.3 });

    l.animate({ strokeWidth: 2 }, DUR / 2)
      .animate({ strokeWidth: 0.3 }, DUR / 2, null, () => l.remove());
    */
  }

  const START_OF_PITCHES = 10367 - 1; // transaction: 452201_1_1 , ts: (30 Sept 2017 15:00:22 GMT+01:00 DST)
  const BANKRUPCY_START = 11482 - 1;   // transaction: 452687_0_0 , ts: 1506787197 ( 30 Sept 2017 16:59:57 GMT+01:00 DST )
  const BANKRUPCY_END = 11528;         // transaction: 452777_0_0 , ts: 1506788361

  function nextTrans() {
    ++trIdx;
    const tr = transactions[trIdx];
    if (!tr) { return --trIdx; }
    renderTransaction(tr, false);
    if ((trIdx === START_OF_PITCHES || trIdx === BANKRUPCY_START || trIdx === BANKRUPCY_END) && interval) {
      clearInterval(interval);
      interval = undefined;
      console.log('PRESS SPACE TO CONTINUE...');
    }
  }

  function prevTrans() {
    --trIdx;
    const tr = transactions[trIdx];
    if (!tr) { return ++trIdx; }
    renderTransaction(tr, true);
  }

  let interval;

  window.addEventListener('keydown', function (ev) {
    const k = ev.keyCode;

    if (k === 39) { nextTrans(); }
    else if (k === 37) { prevTrans(); }
    else if (k === 32) {
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      } else {
        interval = setInterval(nextTrans, DUR * 1.25);
      }
    }
    else { return; }
    ev.preventDefault();
  });

  console.log('PRESS SPACE TO START...');
}