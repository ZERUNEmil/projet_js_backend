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
    const  { rows } = await pool.query('SELECT * FROM project.bids WHERE id_auction = $1', [id_auction]);
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



  async addBid(email, id_auction , body, pool) {
    const id_user = await this.getId(email, pool);

    try {
        const { rows } = await pool.query(
            'INSERT INTO project.bids (time, price, id_user, id_auction) VALUES ($1, $2, $3, $4) RETURNING *',
            [body.time, body.price, id_user.id_user, id_auction]);

        const { rows2 } = await pool.query('UPDATE project.user SET shadow_balance = shadow_balance - $1 WHERE email = $2 RETURNING *', [credits, email]);

        if (!rows[0] || !rows2[0]) return;

        return rows[0];
    } catch (error) {
        throw new Error (error);
    }
}



}

module.exports = { Users };
