"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { parse, serialize } = require("../utils/json");
//var escape = require("escape-html");
const jwtSecret = "lux";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // in ms : 24 * 60 * 60 * 1000 = 24h

const jsonDbPath = __dirname + "/../data/users.json";

const saltRounds = 10;


// hash default password
/*
bcrypt.hash(defaultItems[0].password, saltRounds).then((hashedPassword) => {
  defaultItems[0].password = hashedPassword;
  console.log("Hash of default password:", hashedPassword);
});*/

class Users {
  constructor() {
  }

  // getNextId() {
  //   const items = parse(this.jsonDbPath, this.defaultItems);
  //   let nextId;
  //   if (items.length === 0) nextId = 1;
  //   else nextId = items[items.length - 1].id + 1;

  //   return nextId;
  // }

  /**
   * Returns all items
   * @returns {Array} Array of items
   */
  getAll() {
    const items = parse(this.jsonDbPath, this.defaultItems);
    return items;
  }

  /**
   * Returns the item identified by id
   * @param {number} id - id of the item to find
   * @returns {object} the item found or undefined if the id does not lead to a item
   */
  getOne(id) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.id == id);
    if (foundIndex < 0) return;

    return items[foundIndex];
  }

  /**
   * Returns the item identified by email
   * @param {string} email - email of the item to find
   * @returns {object} the item found or undefined if the email does not lead to a item
   */
  getOneByEmail(email) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.email == email);
    if (foundIndex < 0) return;

    return items[foundIndex];
  }

  /**
   * Add a item in the DB and returns - as Promise - the added item (containing a new id)
   * @param {object} body - it contains all required data to create a item
   * @returns {Promise} Promise reprensents the item that was created (with id)
   */
  async addOne(body) {
    const items = parse(this.jsonDbPath, this.defaultItems);

    // hash the password (async call)
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    // add new item to the menu

    const newitem = {
      id: this.getNextId(),
      username: escape(body.username),
      userlastname: escape(body.userlastname),
      password: hashedPassword,
      email: escape(body.email),
      address: escape(body.address),
      actual_balance: 0,
      shadow_balance: 0,
      nbr_sale: 0,
      nbr_purchases: 0,
      profil_picture: "user.jpg",
    };
    items.push(newitem);
    serialize(this.jsonDbPath, items);
    return newitem;
  }

  /**
   * Delete a item in the DB and return the deleted item
   * @param {number} id - id of the item to be deleted
   * @returns {object} the item that was deleted or undefined if the delete operation failed
   */
  deleteOne(id) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.id == id);
    if (foundIndex < 0) return;
    const itemRemoved = items.splice(foundIndex, 1);
    serialize(this.jsonDbPath, items);

    return itemRemoved[0];
  }

  /**
   * Update a item in the DB and return the updated item
   * @param {number} id - id of the item to be updated
   * @param {object} body - it contains all the data to be updated
   * @returns {object} the updated item or undefined if the update operation failed
   */
  updateOne(id, body) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.id == id);
    if (foundIndex < 0) return;
    // create a new object based on the existing item - prior to modification -
    // and the properties requested to be updated (those in the body of the request)
    // use of the spread operator to create a shallow copy and repl
    const updateditem = { ...items[foundIndex], ...body };
    // replace the item found at index : (or use splice)
    items[foundIndex] = updateditem;

    serialize(this.jsonDbPath, items);
    return updateditem;
  }




  /**
   * Authenticate a user and generate a token if the user credentials are OK
   * @param {*} email
   * @param {*} password
   * @returns {Promise} Promise reprensents the authenticatedUser ({email:..., token:....}) or undefined if the user could not
   * be authenticated
   */

  async login(email, password, pool) {
    const  { rows } = await pool.query('SELECT * FROM project.user WHERE email = $1', [email]);
    const userFound = rows[0];

    if (!userFound) return;
    // checked hash of passwords
    console.log("test");
    const match = await bcrypt.compare(password, userFound.password);
    console.log(match);
    if (!match) return;

    const authenticatedUser = {
      email: email,
      token: "Future signed token",
    };

    // replace expected token with JWT : create a JWT
    const token = jwt.sign(
      { email: authenticatedUser.email }, // session data in the payload
      jwtSecret, // secret used for the signature
      { expiresIn: LIFETIME_JWT } // lifetime of the JWT
    );

    console.log(authenticatedUser);

    authenticatedUser.token = token;
    return authenticatedUser;
  }




  
  /**
   * Create a new user in DB and generate a token
   * @param {*} username
   * @param {*} userlastname
   * @param {*} password
   * @param {*} email
   * @param {*} address
   * @returns the new authenticated user ({email:..., token:....}) or undefined if the user could not
   * be created (if email already in use)
   */

   signup(username, userlastname, password, email, address) {
    const userFound = this.getOneByEmail(email);
    if (userFound) return;

    const newUser = this.addOne({ username: username, userlastname: userlastname, password: password, 
    email : email, address: address});

    
    const authenticatedUser = {
      email: email,
      token: "Future signed token",
    };

    // replace expected token with JWT : create a JWT
    const token = jwt.sign(
      { email: authenticatedUser.email }, // session data in the payload
      jwtSecret, // secret used for the signature
      { expiresIn: LIFETIME_JWT } // lifetime of the JWT
    );

    authenticatedUser.token = token;
    return authenticatedUser;
  }
}

module.exports = { Users };
