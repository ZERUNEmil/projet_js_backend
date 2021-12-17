var express = require('express');
var router = express.Router();
const { Auctions } = require("../model/auctions");
const auctionModel = new Auctions();


/* GET auctions listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* GET ONE */
router.get('/FUNCTION', async function(req, res){
    if (
        !req.body ||
        (req.body.hasOwnProperty("id") && req.body.PARAM.length === 0)
        // Vient des paramètre envoyés en json par le frontend
    )
        return res.status(404).end();

    const auction = await
})