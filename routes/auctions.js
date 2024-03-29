var express = require('express');
var router = express.Router();
const {Auctions} = require("../model/auctions");
const auctionModel = new Auctions();

/* GET auctions listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* GET active auctions listing. */
router.get('/allAuctions', async function (req, res, next) {
    if (
        !req.body ||
        (req.body.hasOwnProperty("idAuction") && req.body.idAuction.length === 0)
        // Vient des paramètre envoyés en json par le frontend
    )
        return res.status(404).end();

    const auction = await auctionModel.getAllActive(req.app.pool);
    
    return res.json(auction);
});

/* GET active auctions listing. */
router.get('/endingAuctions', async function (req, res, next) {
    if (
        !req.body ||
        (req.body.hasOwnProperty("idAuction") && req.body.idAuction.length === 0)
        // Vient des paramètre envoyés en json par le frontend
    )
        return res.status(404).end();

    const auction = await auctionModel.getEndingAuctions(req.app.pool);
    
    return res.json(auction);
});

/* GET active auctions listing. */
router.get('/recentAuctions', async function (req, res, next) {
    if (
        !req.body ||
        (req.body.hasOwnProperty("idAuction") && req.body.idAuction.length === 0)
        // Vient des paramètre envoyés en json par le frontend
    )
        return res.status(404).end();

    const auction = await auctionModel.getRecentAuctions(req.app.pool);
    
    return res.json(auction);
});

/* GET ONE */
router.get('/:idAuction', async function (req, res) {
    if (
        !req.params ||
        (req.params.hasOwnProperty("idAuction") && req.params.idAuction.length === 0)
        // Vient des paramètre envoyés en json par le frontend
    )
        return res.status(404).end();

    const auction = await auctionModel.getOne(req.params.idAuction, req.app.pool);

    return res.json(auction);
})

/* ADD ONE */
router.put('/:email/addAuction', async function (req, res) {
    // Send an error code '400 Bad request' if the body parameters are not valid

    if (
        !req.body ||
        (req.body.hasOwnProperty("name") && req.body.name.length === 0) ||
        (req.body.hasOwnProperty("cover_photo") && req.body.cover_photo.length === 0)
    )
        return res.status(400).end();

    const auction = await auctionModel.addAuction(req.params.email, req.body, req.app.pool);

    if (!auction) return res.json({});

    return res.json(auction);
});

/* DELETE ONE */
router.delete('/:id/deleteAuction', async function (req, res) {

    const auction = await auctionModel.deleteOne(req.params.id, req.app.pool);

    if (! auction) return res.json({});

    return res.json(auction);
})

/* UPDATE ONE */
router.put('/:id/updateAuction', async function(req, res){
    // Send an error code '400 Bad request' if the body parameters are not valid
    if (
        !req.body ||
        (req.body.hasOwnProperty("name") && req.body.name.length === 0)
    )
        return res.status(400).end();

    const auction = await auctionModel.updateAuction(req.params.id, req.body, req.app.pool);

    if (! auction) return res.json({});

    return res.json(auction);
});

/* POST ONE */
router.put('/:id/postAuction', async function(req, res){
    // Send an error code '400 Bad request' if the body parameters are not valid
    if (
        !req.body
    )
        return res.status(400).end();

    const auction = await auctionModel.postAuction(req.params.id, req.body, req.app.pool);

    if (! auction) return res.json({});

    return res.json(auction);
});

module.exports = router;