var express = require('express');
var router = express.Router();
const {Pieces} = require("../model/pieces");
const pieceModel = new Pieces();

/* GET auctions listing. */
router.get('/', function (req, res, next) {
    const pieces = pieceModel.getAll(req.app.pool);

    return res.json(pieces);
});

/* GET ONE */
router.get('/:idPiece', async function (req, res) {
    if (
        !req.body ||
        (req.body.hasOwnProperty("idAuction") && req.body.idPiece.length === 0)
        // Vient des paramètre envoyés en json par le frontend
    )
        return res.status(404).end();

    const piece = await pieceModel.getOne(req.params.idPiece, req.app.pool);

    return res.json(piece);
})

/* ADD ONE */
router.put('/:idAuction/addPiece', async function (req, res) {

    if (!req.body) return res.status(404).end();

    const piece = await pieceModel.addPiece(req.params.idAuction, req.body, req.app.pool);

    if (!piece) return res.json({});

    return res.json(piece);
});

/* DELETE ONE */
router.delete('/:id/deletePiece', async function (req, res) {

    const piece = await pieceModel.deleteOne(req.params.id, req.app.pool);

    if (! piece) return res.json({});

    return res.json(piece);
})

/* UPDATE ONE */
router.put('/:id/updateAuction', async function(req, res){
    // Send an error code '400 Bad request' if the body parameters are not valid
    if (
        !req.body
    )
        return res.status(400).end();

    const piece = await pieceModel.updatePiece(req.params.id, req.body, req.app.pool);

    if (! piece){
        return res.json({});
    }

    return res.json(auction);
});

module.exports = router;

