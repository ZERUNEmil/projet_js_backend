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
     * Returns all active items
     * @returns {Array} Array of items
     */
 async getAllActive(pool) {
    const  { rows } = await pool.query("SELECT * FROM project.auction WHERE status ='Posted' ");
    if (! rows) return;

    return rows;
}
/**
     * Returns all top items
     * @returns {Array} Array of items
     */
 async getEndingAuctions(pool) {
    const  { rows } = await pool.query("SELECT * FROM project.auction WHERE status ='Posted' AND CURRENT_DATE-(date(start_time)+ day_duration )<=5");
    if (! rows) return;

    return rows;
}

/**
     * Returns all top items
     * @returns {Array} Array of items
     */
 async getRecentAuctions(pool) {
    const  { rows } = await pool.query("SELECT DISTINCT a.* FROM project.auction a, project.bids b WHERE a.id_auction = b.id_auction AND status ='Posted' AND  CURRENT_DATE-date(b.time)<=7 ");
    if (! rows) return;

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
                [body.name, body.description, body.start_price, body.day_duration, body.start_time, user_id.id_user, body.cover_photo]);

            if (!rows[0]) return;

            return rows[0];

        } catch (error) {
            throw new Error (error);
        }
    }

    /**
     * Delete a item in the DB and return the deleted item
     * @param {number} id - id of the item to be deleted
     * @returns {object} the item that was deleted or undefined if the delete operation failed
     */
    async deleteOne(id, pool) {
        const  { rows } = await pool.query('DELETE FROM project.auction WHERE id_auction = $1', [id]);
        if (! rows) return;

        return rows[0];
    }

    /**
     * Update a item in the DB and return the updated item
     * @param {number} id - id of the item to be updated
     * @param {object} body - it contains all the data to be updated
     * @returns {object} the updated item or undefined if the update operation failed
     */
    async updateAuction(id, body, pool) {
        try {
            const { rows } = await pool.query('UPDATE project.auction SET name = $1, description = $2, start_price = $3, day_duration = $4, start_time = $5 WHERE id_auction = $6 RETURNING *',
                [body.name, body.description, body.start_price, body.day_duration, body.start_time, id]);

            if (! rows[0]) return;

            return rows[0];
        } catch (error){
            throw new Error(error);
        }
    }

    /**
     * Post a item in the DB and return the updated item
     * @param {number} id - id of the item to be updated
     * @param {object} body - it contains all the data to be updated
     * @returns {object} the updated item or undefined if the update operation failed
     */
    async postAuction(id, body, pool) {
        try {
            const { rows } = await pool.query('UPDATE project.auction SET name = $1, description = $2, start_price = $3, day_duration = $4, start_time = $5, status = $6 WHERE id_auction = $7 RETURNING *',
                [body.name, body.description, body.start_price, body.day_duration, body.start_time, body.status, id]);

            if (! rows[0]) return;

            return rows[0];
        } catch (error){
            throw new Error(error);
        }
    }

}

module.exports = {Auctions};