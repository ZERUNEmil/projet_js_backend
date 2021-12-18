var express = require('express');
var router = express.Router();
const {Auctions} = require("../model/auctions");
const auctionModel = new Auctions();

/* GET auctions listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* GET ONE */
router.get('/:idAuction', async function (req, res) {
    if (
        !req.body ||
        (req.body.hasOwnProperty("idAuction") && req.body.idAuction.length === 0)
        // Vient des paramètre envoyés en json par le frontend
    )
        return res.status(404).end();

    const auction = await auctionModel.getOne(req.params.idAuction, req.app.pool);

    return res.json({
        name: auction.name,
        description: auction.description,
        star_price: auction.star_price,
        day_duration: auction.day_duration,
        start_time: auction.start_time,
        status: auction.status,
        owner: auction.owner,
        cover_photo: auction.cover_photo,
    });
})

/* ADD ONE */
router.put('/:email/addAuction', async function (req, res) {
    // Send an error code '400 Bad request' if the body parameters are not valid

    if (
        !req.body ||
        (req.body.hasOwnProperty("name") && req.body.name.length === 0)
    )
        return res.status(400).end();

    const auction = await auctionModel.addAuction(req.params.email, req.body, req.app.pool);

    if (!auction) return res.json({});

    return res.json({
        id_auction: auction.id_auction,
        name: auction.name,
        description: auction.description,
        star_price: auction.star_price,
        day_duration: auction.day_duration,
        start_time: auction.start_time,
        status: auction.status,
        owner: auction.owner,
        cover_photo: auction.cover_photo,
    });
});

module.exports = router;