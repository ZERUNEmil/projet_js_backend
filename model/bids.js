"use strict";



// hash default password
/*
bcrypt.hash(defaultItems[0].password, saltRounds).then((hashedPassword) => {
  defaultItems[0].password = hashedPassword;
  console.log("Hash of default password:", hashedPassword);
});*/

class Bids {
  constructor() {
  }

  /**
   * Returns all items
   * @returns {Array} Array of items
   */
  async getAll(pool) {
    const  { rows } = await pool.query('SELECT * FROM project.bids');
    if (! rows) return;
    
    return rows;
  }


  
  /**
   * Returns the item identified by id
   * @param {number} id - id of the item to find
   * @returns {object} the item found or undefined if the id does not lead to a item
   */
   async getOne(id, pool) {
    const  { rows } = await pool.query('SELECT * FROM project.bids WHERE id_bid = $1', [id]);
    if (! rows) return;
    
    return rows[0];
  }

  /**
   * Returns the item identified by id
   * @param {number} id - id of the item to find
   * @returns {object} the item found or undefined if the id does not lead to a item
   */
  async getBidsByAction(id_auction, pool) {
    const  { rows } = await pool.query('SELECT bi.time, bi.price, us.lastname FROM project.bids bi, project.user us WHERE bi.id_auction = $1 AND bi.id_user = us.id_user ORDER BY time DESC', [id_auction]);
    if (! rows) return;
    
    return rows;
  }

  async getLastBidAuction(id_auction, pool){
    const  { rows } = await pool.query('SELECT bi.id_bid, bi.id_user, bi.price FROM project.bids bi, project.user us WHERE bi.id_auction = $1 AND bi.id_user = us.id_user ORDER BY time DESC', [id_auction]);
    if (! rows) return;
    
    return rows;
  }

  /**
   * Returns the item identified by id
   * @param {number} id - id of the item to find
   * @returns {object} the item found or undefined if the id does not lead to a item
   */
   async getBidsByUser(id_user, pool) {
    const  { rows } = await pool.query('SELECT * FROM project.bids WHERE id_user = $1', [id_user]);
    if (! rows) return;
    
    return rows;
  }



  async addBid(email, id_auction , credits, pool) {

    try {
        const user = await pool.query('UPDATE project.user SET shadow_balance = shadow_balance - $1 WHERE email = $2 RETURNING id_user', [credits, email]);
        const user_id = user.rows[0].id_user;

        const { rows } = await pool.query(
          'INSERT INTO project.bids (time, price, id_user, id_auction) VALUES (NOW(), $1, $2, $3) RETURNING *',
          [credits, user_id, id_auction]);
        if (!rows[0]) return;

        return rows[0];
    } catch (error) {
        throw new Error (error);
    }
}

async soldBid(id_bid, pool){
  const  { rows } = await pool.query('UPDATE  project.bids SET sold = true WHERE id_bid = $1', [id_bid]);
    if (! rows) return;
    
    return rows;
}



}

module.exports = { Bids };
