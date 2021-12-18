"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { parse, serialize } = require("../utils/json");
const res = require("express/lib/response");
const { user } = require("pg/lib/defaults");
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

  /**
   * Returns all items
   * @returns {Array} Array of items
   */
  async getAll(pool) {
    const  { rows } = await pool.query('SELECT * FROM project.user');
    if (! rows) return;
    
    return rows;
  }

  /**
   * Returns the item identified by id
   * @param {number} id - id of the item to find
   * @returns {object} the item found or undefined if the id does not lead to a item
   */
  async getOne(id, pool) {
    const  { rows } = await pool.query('SELECT * FROM project.user WHERE id_user = $1', [id]);
    if (! rows) return;
    
    return rows[0];
  }

  async getId(email, pool) {
    const  { rows } = await pool.query('SELECT id_user FROM project.user WHERE email = $1', [email]);
    if (! rows) return;
    
    return rows[0];
  }

  /**
   * Returns the item identified by email
   * @param {string} email - email of the item to find
   * @returns {object} the item found or undefined if the email does not lead to a item
   */
  async getOneByEmail(email, pool) {
    const  { rows } = await pool.query('SELECT * FROM project.user WHERE email = $1', [email]);
    if (! rows) return;
    
    return rows[0];
  }

  /**
   * Add a item in the DB and returns - as Promise - the added item (containing a new id)
   * @param {object} body - it contains all required data to create a item
   * @returns {Promise} Promise reprensents the item that was created (with id)
   */
  async addOne(body, pool) {
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
  async DeleteOne(id, pool) {
    const  { rows } = await pool.query('DELETE FROM project.user WHERE id_user = $1', [id]);
    if (! rows) return;
    
    return rows[0];
  }

  /**
   * Update a item in the DB and return the updated item
   * @param {number} id - id of the item to be updated
   * @param {object} body - it contains all the data to be updated
   * @returns {object} the updated item or undefined if the update operation failed
   */
  async updateProfil(email, body, pool) {
    try {
      const { rows } = await pool.query('UPDATE project.user SET email = $1, firstname = $2, lastname = $3 WHERE email = $4 RETURNING *', [body.email, body.firstname, body.lastname, email]);
      if (! rows[0]) return;

      return rows[0];
    } catch (error){
      throw new Error(error);
    }
  }

  async updatePassword(email, password, pool){
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
      const { rows } = await pool.query('UPDATE project.user SET password = $1 WHERE email = $2 RETURNING *', [hashedPassword, email]);

      if (! rows[0]) return;

      return rows[0];
    } catch (error){
      throw new Error(error);
    }
  }

  async addCredits(email, credits, pool){
    try {
      const { rows } = await pool.query('UPDATE project.user SET effective_balance = effective_balance + $1, shadow_balance = shadow_balance + $1 WHERE email = $2 RETURNING *', [credits, email]);

      if (! rows[0]) return;

      return rows[0];
    } catch (error){
      throw new Error(error);
    }
  }

  async getAdress(email, pool){
    const  { rows } = await pool.query('SELECT * FROM project.user us, project.adress ad WHERE us.email = $1 AND us.id_user = ad.id_user', [email]);
    if (! rows) return;
    
    return rows[0];
  }

  async getAuctionBids(email, pool){
    const userId = await this.getId(email, pool);

    const  { rows } = await pool.query('SELECT au.name AS "Nom de l\'enchère", au.id_auction, MAX(bi.time) AS "Date", MAX(bi.price) AS "Votre enchère max", topBi.price AS "Enchère max", us.lastname AS "Enchérisseur", us.email,  topBi.sold AS "Statut" FROM project.auction au, project.bids bi, project.bids topBi, project.user us WHERE bi.id_user = $1 AND au.id_auction = bi.id_auction AND topBi.id_auction = au.id_auction AND us.id_user = topBi.id_user AND topBi.price IN (SELECT MAX(bi2.price) FROM project.bids bi2 WHERE bi2.id_auction = au.id_auction GROUP BY bi2.id_auction ) GROUP BY au.name, au.id_auction, topBi.price, us.lastname, us.email, topBi.sold ORDER BY MAX(bi.time) DESC', [userId.id_user]);

    if (! rows) return;
    
    return rows;
  }

  async getAuctions(email, pool){
    const userId = await this.getId(email, pool);

    const  { rows } = await pool.query('SELECT au.name AS "Annonce", au.id_auction, au.description AS "Description", bi.price AS "Prix actuel", au.status AS "Statut", au.day_duration, au.start_time FROM project.auction au FULL OUTER JOIN project.bids bi ON au.id_auction = bi.id_auction WHERE owner = $1 AND (bi.price IS NULL OR bi.price IN (SELECT MAX(bi2.price) FROM project.bids bi2 WHERE bi2.id_auction = au.id_auction GROUP BY bi2.id_auction ))', [userId.id_user]);

    if (! rows) return;
    
    return rows;
  }

  async setAdress(email, body, pool){
    const user_id = await this.getId(email, pool);
    try {
      const { rows } = await pool.query('INSERT INTO project.adress VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [user_id.id_user, body.street, body.number, body.box, body.city, body.postalCode, body.country]);
      
      if (! rows[0]) return;

      return rows[0];
    } catch (error){
      throw new Error(error);
    }
  }

  async updateAdress(email, body, pool){
    const user_id = await this.getId(email, pool);
    try {
      const { rows } = await pool.query('UPDATE project.adress SET street = $1, number = $2, box = $3, city =  $4, postal_code = $5, country = $6 WHERE id_user = $7 RETURNING *', [body.street, body.number, body.box, body.city, body.postalCode, body.country, user_id.id_user]);
      console.log(rows);
      if (! rows[0]) return;

      return rows[0];
    } catch (error){
      throw new Error(error);
    }
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
    const match = await bcrypt.compare(password, userFound.password);

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
