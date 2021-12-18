"use strict";


class Auctions {
    constructor() {
    }
    /**
     * Returns all items
     * @returns {Array} Array of items
     */
    async getAll(pool) {
        const  { rows } = await pool.query('SELECT * FROM project.auction');
        if (! rows) return;

        return rows;
    }

/**
     * Returns all active items
     * @returns {Array} Array of items
     */
 async getAllActive(pool) {
    const  { rows } = await pool.query('SELECT * FROM project.auction WHERE status = "In Progress"');
    if (! rows) return;

    return rows;
}

    /**
     * Returns the item identified by id
     * @param {number} id - id of the item to find
     * @returns {object} the item found or undefined if the id does not lead to a item
     */
    async getOne(id, pool) {
        const  { rows } = await pool.query('SELECT * FROM project.auction WHERE id_auction = $1', [id]);
        if (! rows) return;

        return rows[0];
    }

    /**
     * Add a item in the DB and returns - as Promise - the added item (containing a new id)
     * @param {object} body - it contains all required data to create a item
     * @returns {Promise} Promise reprensents the item that was created (with id)
     */
    async addAuction(body, pool) {
    }

}

module.exports = { Auctions };