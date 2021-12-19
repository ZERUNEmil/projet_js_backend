var express = require('express');
var router = express.Router();
const { Bids } = require("../model/bids");
const bidsModel = new Bids();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

  router.get('/:id_auction/getBidsByAction', async function(req, res){  
    // Send an error code '400 Bad request' if the body parameters are not valid
    if (
      !req.body
    )
      return res.status(400).end();
  
    const bids = await bidsModel.getBidsByAction(req.params.id_auction, req.app.pool);
  
    if (! bids){
      return res.json({});
    }
  
    return res.json(bids);
  });

router.put("/:email/:id_auction/addBid", async function (req, res, next) {
  if (
    !req.body ||
    (req.body.hasOwnProperty("price") && req.body.price.length === 0)  
  )
    return res.status(400).end();

    const bid = await bidsModel.addBid(req.params.email, req.params.id_auction, req.body.price, req.app.pool);

    if (!bid) return res.json({});

    return res.json(bid);
});



module.exports = router;
