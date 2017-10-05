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

  const specialAccounts = {
    '3d417b8305aa60688385a1ca56530130c77f8739': 'PIXELSCAMP',
    '3aaec243e4d22484061b7123d0686136d9edddb1': 'APPLY_BANKRUPCY'
  }

  function getName(accNo) {
    const special = specialAccounts[accNo];
    if (special) { return special; }
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
      return `User ${u.name} of ${p.name}`;
    }
    const u = w2u[accNo];
    if (u) {
      return `User ${u.name}`;
    }
    return `Account ${accNo}`;
  }

  function getNameEl(accNo) {
    const special = specialAccounts[accNo];
    if (isProject(accNo)) {
      return EL('span.acc.acc-project', [
        'Proj ',
        EL('a', { href: '#' + accNo }, [w2p[accNo].name])
      ]);
    }
    if (isAngel(accNo)) {
      const u = w2u[accNo];
      const n = u && u.name || a2n[accNo];
      return EL('span.acc.acc-angel', [
        'Angel ',
        EL('a', { href: '#' + accNo }, [n])
      ]);
    }
    if (isUserWithProject(accNo)) {
      const u = w2u[accNo];
      const p = w2p[u2p[accNo]];
      return EL('span.acc.acc-user.acc-puser', [
        'User ',
        EL('a', { href: '#' + accNo }, [u.name]),
        ' of ',
        EL('a', { href: '#' + p.wallet }, [p.name])
      ]);
    }
    const u = w2u[accNo];
    if (u) {
      const u = w2u[accNo];
      return EL('span.acc.acc-user', [
        'User ',
        EL('a', { href: '#' + accNo }, [u.name])
      ]);
    }
    return EL('span.acc.acc-other', [
      'Account ',
      EL('a', { href: '#' + accNo }, [special || accNo])
    ]);
  }


  const W = 1200;
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

  function groupTrans(arr) { // t = [eth, accNo, trIdx]
    const where = {};
    return arr.reduce((acc, tr) => {
      const accIdx = where[tr[1]];
      if (accIdx === undefined) {
        where[tr[1]] = acc.length;
        acc.push([tr[0], tr[1]]);
      } else {
        const row = acc[accIdx];
        row[0] += tr[0];
      }
      return acc;
    }, []);
  }

  function sign(n) { return (n < 0 ? -1 : (n > 0 ? 1 : 0)); }

  function sortNumber(a, b) {
    return sign(a - b);
  }

  function sortDesc(sortFn) {
    return function (a, b) {
      return sortFn(b, a);
    }
  }

  function nthIndexer(idx) {
    return function (arr) {
      return arr[idx];
    }
  }

  function sort(arr, indexer, sortFn) {
    arr.sort(function (a, b) { return sortFn(indexer(a), indexer(b)); })
  }



  function EL(_nodeName, _attrs, _children) {
    let attrs = {}, children = [];
    const argLen = arguments.length;
    if (argLen === 1) { return document.createTextNode(_nodeName); }
    else if (argLen === 2) {
      if (_attrs instanceof Array) { children = _attrs; }
      else if (_attrs instanceof Object) { attrs = _attrs; }
      else { throw new Error('2nd arg must be either an object (attrs) or an array (children)!'); }
    }
    else if (argLen === 3) { attrs = _attrs; children = _children; }
    else { throw new Error('Wrong number of params!'); }
    const classes = (_nodeName.indexOf('.') === -1) ? [_nodeName] : _nodeName.split('.');
    const nodeName = classes.shift();
    const el = document.createElement(nodeName);
    classes.forEach(cl => el.classList.add(cl));
    Object.keys(attrs).forEach(at => el.setAttribute(at, attrs[at]));
    children.forEach(chEl => el.appendChild(typeof chEl === 'string' ? EL(chEl) : chEl));
    return el;
  }

  function killOverlay() {
    let ctnEl = document.querySelector('.overlay');
    if (ctnEl) { ctnEl.parentNode.removeChild(ctnEl); }
  }

  function inspectNode(ev) {
    const el = Snap(ev.target);
    const data = el.data();
    //console.log(data.trans);
    const gt = groupTrans(data.trans);
    sort(gt, nthIndexer(0), sortDesc(sortNumber));
    //console.log(gt);

    killOverlay();

    const rows = gt.map(t => EL('tr', [
      EL('td.tar', [t[0].toFixed(3)]),
      EL('td.tal', [getNameEl(t[1])])
    ]));

    const wallet = el.data('wallet');

    const ctnEl = EL('div.overlay', { style: 'width:500px; margin-left:-250px; height:300px; margin-top:-150px' }, [
      EL('p', [
        EL('label', ['title:']),
        EL('span.title', [data.title])
      ]),
      EL('p', [
        EL('label', ['account:']),
        EL('span.account', [
          EL('a', { target: '_blank', href: `http://moon.pixels.camp:8548/account/0x${wallet}` }, [
            wallet
          ])
        ])
      ]),
      EL('p', [
        EL('label', ['balance:']),
        EL('span.balance', [data.eth.toFixed(3)])
      ]),
      EL('table', [
        EL('tr', [
          EL('th.tar', ['amount']),
          EL('th.tal', ['account'])
        ]),
        ...rows
      ])
    ]);
    document.body.appendChild(ctnEl);
    ctnEl.onclick = killOverlay;
    //window.alert(data.title + ' - ' + data.eth.toFixed(3));
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
    })
      .data('wallet', w)
      .data('title', name)
      .data('eth', 0)
      .data('trans', []);

    c.click(ev => {
      location.hash = Snap(ev.target).data('wallet');
      //inspectNode(ev);
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
      n0.data('title'),
      (toTheFuture ? '<-' : '--'),
      tr.a,
      (toTheFuture ? '--' : '->'),
      n1.data('title')
    );

    let e = n0.data('eth');
    e += a;
    n0.data('eth', e);

    let trans = n0.data('trans');
    trans.push([a, tr.t, /*getName(tr.t),*/ trIdx]);
    //n0.data('trans', trans);

    let r = Math.sqrt(e / Math.PI);
    if (r < MIN_R || isNaN(r)) { r = MIN_R; }
    r = Math.max(r, MIN_R);
    n0.attr({ r: r }, DUR);

    e = n1.data('eth');
    e -= a;
    n1.data('eth', e);

    trans = n1.data('trans');
    trans.push([-a, tr.f, /*getName(tr.f),*/ trIdx]);
    //n1.data('trans', trans);

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



  window.addEventListener('hashchange', ev => {
    ev.preventDefault();
    //ev.stopPropagation();
    const id = location.hash.substring(1);
    console.log('ID [%s]', id);
    if (!id) { return; }
    inspectNode({ target: nodes[id] });
  });



  const nodesPerKind = {
    angels: [],
    users: [],
    projects: [],
    other: []
  };
  wallets.forEach(w => {

  });

  function toggleKind(kind) {
    //const accounts = wallets.
  }
  window.toggleKind = toggleKind;
}