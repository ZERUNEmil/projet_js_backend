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

  const user = await userModel.getOneByEmail(req.params.email, req.app.pool);


  return res.json({firstname: user.firstname,
      lastname: user.lastname,
      adress: user.adress,
      effective_balance: user.effective_balance,
      shadow_balance: user.shadow_balance,
      sales_number: user.sales_number,
      purchases_number: user.purchases_number,
      profil_picture: user.profil_picture,
      email: user.email});
});

router.put('/:email/updateProfil', async function(req, res){
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("email") && req.body.email.length === 0) ||
    (req.body.hasOwnProperty("firstname") && req.body.firstname.length === 0) ||
    (req.body.hasOwnProperty("lastname") && req.body.lastname.length === 0)
  )
    return res.status(400).end();

  try {
    let user = await userModel.updateProfil(req.params.email, req.body, req.app.pool);
    if (!user) return res.status(304).end();
    return res.json(user);
  }catch (error){
    return res.status(420).end();
  }
});

module.exports = router;
