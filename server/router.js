const { Database, aql } = require("arangojs");

const arangoDb = new Database({
  agentOptions: {
    maxSockets: 325,
    keepAlive: true
  },
  LoadBalancingStrategy: 'ROUND_ROBIN',
  QueryOptions: {
    stream: true,
  }
});

arangoDb.useDatabase('stayio');
arangoDb.useBasicAuth('root', '');
const listings = arangoDb.collection('listings');



const express = require('express')


const router = express.Router();

router.get = ('/:id/photos', async (req, res)=> {
  const listingId = req.params.id;
  try {
    const listing = await arangoDb.query(aql`
    FOR home IN listings
    FILTER home._key == ${listingId}
    RETURN home
    `);
      res.status(200).send(listing._result)
    } catch(err) {
      res.sendStatus(404)
    }
  }
);

module.exports = router

