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
    !req.body
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
    console.log(user);
    if (!user) return res.status(304).end();
    return res.json(user);
  }catch (error){
    return res.status(420).end();
  }
});

router.put('/:email/updatePassword', async function(req, res){
  if(
    !req.body ||
    (req.body.hasOwnProperty("password") && req.body.password.length === 0)
  )
    return res.status(400).end;

  try {
    let user = await userModel.updatePassword(req.params.email, req.body.password, req.app.pool);
    if (!user) return res.status(304).end();
    return res.json(user);
  }catch (error){
    return res.status(420).end();
  }
})

router.put('/:email/addCredits', async function(req, res){
  if(
    !req.body ||
    (req.body.hasOwnProperty("credits") && req.body.credits.length === 0)
  )
    return res.status(400).end;

  try {
    let user = await userModel.addCredits(req.params.email, req.body.credits, req.app.pool);
    if (!user) return res.status(304).end();
    return res.json(user);
  }catch (error){
    return res.status(420).end();
  }
})

router.get('/:email/getAdress', async function(req, res){  
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body
  )
    return res.status(400).end();

  const adress = await userModel.getAdress(req.params.email, req.app.pool);

  if (! adress){
    return res.json({});
  }


  return res.json({street: adress.street,
      number: adress.number,
      box: adress.box,
      city: adress.city,
      postalCode: adress.postal_code,
      country: adress.country});
});

router.put('/:email/setAdress', async function(req, res){  
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("number") && req.body.number.length === 0) ||
    (req.body.hasOwnProperty("street") && req.body.street.length === 0) ||
    (req.body.hasOwnProperty("city") && req.body.city.length === 0) ||
    (req.body.hasOwnProperty("postalCode") && req.body.postalCode.length === 0) ||
    (req.body.hasOwnProperty("country") && req.body.country.length === 0)
  )
    return res.status(400).end();

  const adress = await userModel.setAdress(req.params.email, req.body, req.app.pool);

  if (! adress){
    return res.json({});
  }


  return res.json({street: adress.street,
      number: adress.number,
      box: adress.box,
      city: adress.city,
      postalCode: adress.postal_code,
      country: adress.country});
});

router.put('/:email/updateAdress', async function(req, res){  
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("number") && req.body.number.length === 0) ||
    (req.body.hasOwnProperty("street") && req.body.street.length === 0) ||
    (req.body.hasOwnProperty("city") && req.body.city.length === 0) ||
    (req.body.hasOwnProperty("postalCode") && req.body.postalCode.length === 0) ||
    (req.body.hasOwnProperty("country") && req.body.country.length === 0)
  )
    return res.status(400).end();

  const adress = await userModel.updateAdress(req.params.email, req.body, req.app.pool);

  if (! adress){
    return res.json({});
  }


  return res.json({street: adress.street,
      number: adress.number,
      box: adress.box,
      city: adress.city,
      postalCode: adress.postal_code,
      country: adress.country});
});

router.get('/:email/getAuctionBids', async function(req, res){  
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body
  )
    return res.status(400).end();

  const auctionBids = await userModel.getAuctionBids(req.params.email, req.app.pool);

  if (! auctionBids){
    return res.json({});
  }

  return res.json(auctionBids);
});

router.get('/:email/getAuctions', async function(req, res){  
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body
  )
    return res.status(400).end();

  const auctionBids = await userModel.getAuctions(req.params.email, req.app.pool);

  if (! auctionBids){
    return res.json({});
  }

  return res.json(auctionBids);
});

module.exports = router;
