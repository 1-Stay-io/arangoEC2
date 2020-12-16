const fs = require('fs');
const faker = require('faker');
const milTenMil = require('../pregenerated/milTenMil');
const milThousand = require('../pregenerated/milThousand');

let lastIndex = 0;
randNumTenMil = () => {
  if (lastIndex >= 1000000) {
    lastIndex = randInt(10);
  }
  lastIndex += 1;
  return milTenMil[lastIndex];
};

let thouIndex = 0;
randNumThousand = () => {
  if (thouIndex >= 1000000) {
    thouIndex = randInt(10);
  }
  thouIndex += 1;
  return milThousand[thouIndex];
};

randInt = (n) => {
  return Math.floor(Math.random() * n) + 1;
};

randomNumBetween = (min, max) => Math.floor(Math.random() * (max - min) + min);

// randArrayOfListings = () => {
//   let result = [];
//   for (var i = 0; i < randInt(10); i++) {
//     result.push(randNumTenMil());
//   }
//   return result;
// };

randArrayOfPhotos = () => {
  let result = [];
  for (var i = 0; i < randInt(10); i++) {
    result.push(photoGenerator());
  }
  return result;
}

photoGenerator = () => {
  return `https://stayio.s3-us-west-1.amazonaws.com/Airbnb_images/home${randNumThousand()}.jpg`;
};

let listingNum = 1;
let userNum = 1;
let favListNum = 1;

createListing = () => {
  let listing = {
    _key          : `${listingNum}`,
    listingName        : faker.lorem.words(2),
    listingDescription : faker.lorem.sentence(),
    listingLocation    : faker.address.city() + ', ' + faker.address.stateAbbr(),
    listingStars       : randNumThousand() / 200,
    listingNumReviews  : randNumTenMil(),
    photos: randArrayOfPhotos()
  };
  listingNum++;
  return listing;
};

  const dataGen = (i, name, createFunc, cb) => {
    console.time(name);
    const writer = fs.createWriteStream(__dirname + `/csv/${name}.json`);

    function write() {
      let ok = true;
      do {
        if (i % 1000000 === 0) {
          console.log(name, i);
        }
        i--;
        let newItem = JSON.stringify(createFunc());
        if (i === 0) {
          writer.write(newItem, cb);
        } else {
          ok = writer.write(newItem +'\n');
        }
      } while (i > 0 && ok);
      if (i > 0) {
        writer.once('drain', write);
      }
    }
    write();
  };

  dataGen(10000000, 'jsonListing', createListing, () => {
    console.timeEnd('jsonListing');
  });