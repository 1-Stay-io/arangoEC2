const fs = require('fs');

randInt = (n) => {
  return Math.floor(Math.random() * (n + 1));
};

const createRandomNumArrays = (n, max) => {
  let result = [];
  for (var i = 0; i < n; i++) {
    result.push(randInt(max));
  }
  return result;
};

const milTenMil = createRandomNumArrays(1000000, 10000000);

const milThousand = createRandomNumArrays(1000000, 1000);

const storeArray = (data, path) => {
  try {
    fs.writeFileSync(path, data);
  } catch (err) {
    console.log(err);
  }
};

storeArray(milTenMil, __dirname + `/milTenMil.js`);

storeArray(milThousand, __dirname + `/milThousand.js`);
