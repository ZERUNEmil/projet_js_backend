"use strict";


class Auctions {
    constructor() {
    }

    /**
     * Returns all items
     * @returns {Array} Array of items
     */
    async getAll(pool) {
        const {rows} = await pool.query('SELECT * FROM project.auction');
        if (!rows) return;

        return rows;
    }

    /**
     * Returns the item identified by id
     * @param {number} id - id of the item to find
     * @returns {object} the item found or undefined if the id does not lead to a item
     */
    async getOne(id, pool) {
        const {rows} = await pool.query('SELECT * FROM project.auction WHERE id_auction = $1', [id]);
        if (!rows) return;

        return rows[0];
    }

    /**
     * Get the ID of the owner
     * @param email
     * @param pool
     * @returns {user_id} of the owner
     */
    async getOwnerId(email, pool) {
        const {rows} = await pool.query('SELECT id_user FROM project.user WHERE email = $1', [email]);
        if (!rows) return;

        return rows[0];
    }

    /**
     * Add a item in the DB and returns - as Promise - the added item (containing a new id)
     * @param {object} body - it contains all required data to create a item
     * @returns {Promise} Promise reprensents the item that was created (with id)
     */
    async addAuction(email, body, pool) {
        const user_id = await this.getOwnerId(email, pool);
        try {
            const {rows} = await pool.query(
                'INSERT INTO project.auction (name, description, start_price, day_duration, start_time, owner, cover_photo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [body.auctionName, body.auctionDescription, body.start_price, body.day_duration, body.start_time, user_id.id_user]);

            if (!rows[0]) return;

            return rows[0];

        } catch (error) {
            throw new Error (error);
        }
    }
}

module.exports = {Auctions};