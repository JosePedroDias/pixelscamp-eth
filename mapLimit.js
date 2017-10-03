
function eachN(arr, n) {
  const arr0 = arr.slice();
  const arrs = [];
  while (arr0.length > 0) {
    arrs.push(arr0.splice(0, n));
  }
  return arrs;
}

function mapLimit(arr, promFn, limit) {
  const arrs = eachN(arr, limit);
  let results = [];
  return new Promise(function (resolve, reject) {
    function step() {
      const batch = arrs.shift();
      if (!batch) { return resolve(results); }
      Promise.all(batch.map(promFn))
        .then(function (subRes) {
          results = results.concat(subRes);
          step();
        })
        .catch(function (err) {
          reject(err);
        });
    }
    step();
  });
}

module.exports = mapLimit;