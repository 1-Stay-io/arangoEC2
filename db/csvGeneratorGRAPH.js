const fs = require('fs');
const csvWriter = require('csv-write-stream');
const faker = require('faker');
// const milTenMil = require('../pregenerated/milTenMil');
// const milThousand = require('../pregenerated/milThousand');

const writer = csvWriter();

//helper functions----------------------------------------------

let listForFav = 0;
getFavForList = () => {
  if (listForFav > 9999999) {
    listForFav = 1;
  } else {
    listForFav += 1;
  }
  return listForFav;
}

let userForList = 0;
getUserForList = () => {
  if (userForList > 999999) {
    userForList = 1;
  } else {
    userForList += 1;
  }
  return userForList;
}


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
  for (var i = 0; i < randInt(20); i++) {
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
    _key          : listingNum,
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

createUser = () => {
  let user = {
    _key   : userNum,
    userName : faker.lorem.word(),
    listId   : randNumTenMil(),
    listName : faker.lorem.words(2)
    // favorites : randArrayOfListings()
  };
  userNum++;
  return user;
};

createFavList = () => {
  let favList = {
    _key   : favListNum,
    userId      : randNumTenMil(),
    favlistName : faker.lorem.word()
  };
  favListNum++;
  return favList;
};

createOwnsEdge = () => {
  let ownsEdge = {
    _from : 'user/' + getUserForList(),
    _to   : 'favList/' + randInt(3000000)
  };
  return ownsEdge;
};

createContainsEdge = () => {
  let containsEdge = {
    _from : 'favList/' + getFavForList(),
    _to   : 'listing/' + randInt(10000000)
  };
  return containsEdge;
};

const dataGen = (i, name, createFunc, cb) => {
  console.time(name);
  const writer = csvWriter();
  writer.pipe(fs.createWriteStream(__dirname + `/csvOrJSON/${name}.csv`));

  function write() {
    let ok = true;
    do {
      if (i % 1000000 === 0) {
        console.log(name, i);
      }
      i--;
      let newItem = createFunc();
      if (i === 0) {
        writer.write(newItem, cb);
      } else {
        ok = writer.write(newItem);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write();
};

dataGen(10000000, 'graphListing', createListing, () => {
  writer.end();
  console.timeEnd('graphListing');
});

dataGen(1000000, 'graphUser', createUser, () => {
  writer.end();
  console.timeEnd('graphUser');
});

dataGen(3000000, 'graphOwnsEdge', createOwnsEdge, () => {
  writer.end();
  console.timeEnd('graphOwnsEdge');
});

dataGen(10000000, 'graphFavList', createFavList, () => {
  writer.end();
  console.timeEnd('graphFavList');
});

dataGen(30000000, 'graphContainsEdge', createContainsEdge, () => {
  writer.end();
  console.timeEnd('graphContainsEdge');
});
