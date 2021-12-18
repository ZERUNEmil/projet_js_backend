"use strict";


class Pieces {
    constructor() {
    }

    /**
     * Returns all items
     * @returns {Array} Array of items
     */
    async getAll(pool) {
        const {rows} = await pool.query('SELECT * FROM project.piece');
        if (!rows) return;

        return rows;
    }

    /**
     * Returns the item identified by id
     * @param {number} id - id of the item to find
     * @returns {object} the item found or undefined if the id does not lead to a item
     */
    async getOne(id, pool) {
        const {rows} = await pool.query('SELECT * FROM project.piece WHERE id_piece = $1', [id]);
        if (!rows) return;

        return rows[0];
    }

    /**
     * Add a item in the DB and returns - as Promise - the added item (containing a new id)
     * @param {object} body - it contains all required data to create a item
     * @returns {Promise} Promise reprensents the item that was created (with id)
     */
    async addPiece(idAuction, body, pool) {

        try {
            const {rows} = await pool.query(
                'INSERT INTO project.piece (name, description, artists, signed, partner, collection, type, size, art_movement, location, id_auction, millenium, first_century, second_century, precise_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *',
                [body.name, body.description, body.artist, body.signed, body.partner, body.collection, body.type, body.size, body.art_movement, body.location, idAuction, body.millenium, body.first_century, body.second_century, body.precise_date]);

            if (!rows[0]) return;

            return rows[0];

        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = {Pieces};