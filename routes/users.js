var express = require('express');
var router = express.Router();
const { Users } = require("../model/users");
const userModel = new Users();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:email', async function(req, res){  
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("email") && req.body.email.length === 0)
  )
    return res.status(400).end();

  const user = await userModel.getOneByEmail(req.params.email);

  if (!user) return res.status(401).end();

  return res.json({username: user.username,
      userlastname: user.userlastname,
      adress: user.adress,
      actual_balance: user.actual_balance,
      shadow_balance: user.shadow_balance,
      nbr_sale: user.nbr_sale,
      nbr_purchases: user.nbr_purchases,
      profil_picture: user.profil_picture});
});

module.exports = router;
