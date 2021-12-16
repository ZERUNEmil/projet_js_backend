var express = require("express");
var router = express.Router();
const { Users } = require("../model/users");
const userModel = new Users();

/* Signup a user : POST /auths/signup */
router.post("/signup", async function (req, res, next) {
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("username") && req.body.username.length === 0) ||
    (req.body.hasOwnProperty("userlastname") && req.body.userlastname.length === 0) ||
    (req.body.hasOwnProperty("password") && req.body.password.length === 0) ||
    (req.body.hasOwnProperty("email") && req.body.email.length === 0) 
    //|| (req.body.hasOwnProperty("address")) 
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.signup(
    req.body.username,
    req.body.userlastname,
    req.body.password,
    req.body.email,
    req.body.address
  );
  // Error code '409 Conflict' if the email already exists
  if (!authenticatedUser) return res.status(409).end();

  // Create the session data (to be put into a cookie)
  req.session.email = authenticatedUser.email;
  req.session.token = authenticatedUser.token;

  return res.json({ email: authenticatedUser.email });
});


/* login a user : POST /auths/login */
router.post("/login", async function (req, res, next) {
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("email") && req.body.email.length === 0) ||
    (req.body.hasOwnProperty("password") && req.body.password.length === 0)
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.login(
    req.body.email,
    req.body.password,
    req.app.pool
  );
  // Error code '401 Unauthorized' if the user could not be authenticated
  if (!authenticatedUser) return res.status(401).end();

  // Create the session data (to be put into a cookie)
  req.session.email = authenticatedUser.email;
  req.session.token = authenticatedUser.token;

  return res.json({ email: authenticatedUser.email });
});


/* Logout a user : POST /auths/logout */
router.get("/logout", async function (req, res, next) {
  req.session = null;
  return res.status(200).end();
});

module.exports = router;
