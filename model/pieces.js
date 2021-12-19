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
        const {rows} = await pool.query('SELECT * FROM project.piece WHERE id_auction = $1', [id]);
        if (!rows) return;

        return rows[0];
    }

    /**
     * Add a item in the DB and returns - as Promise - the added item (containing a new id)
     * @param {object} body - it contains all required data to create a item
     * @returns {Promise} Promise reprensents the item that was created (with id)
     */
    async addPiece(id, body, pool) {

        try {
            const {rows} = await pool.query(
                'INSERT INTO project.piece (name, description, artists, signed, partner, collection, type, size, art_movement, location, id_auction, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
                [body.name, body.description, body.artist, body.signed, body.partner, body.collection, body.type, body.size, body.art_movement, body.location, id, body.date]);

            if (!rows[0]) return;

            return rows[0];

        } catch (error) {
            throw new Error(error);
        }
    }

    async addPicture(id, body, pool) {

        try {
            const {rows} = await pool.query(
                'INSERT INTO project.piece_picture (name, link, html_label, id_piece) VALUES ($1, $2, $3, $4) RETURNING *',
                [body.name, body.picture, body.label, id]);

            if (!rows[0]) return;

            return rows[0];

        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Delete a item in the DB and return the deleted item
     * @param {number} id - id of the item to be deleted
     * @returns {object} the item that was deleted or undefined if the delete operation failed
     */
    async deleteOne(id, pool) {
        const  { rows } = await pool.query('DELETE FROM project.piece WHERE id_auction = $1', [id]);
        if (! rows) return;

        return rows[0];
    }

    /**
     * Update a item in the DB and return the updated item
     * @param {number} id - id of the item to be updated
     * @param {object} body - it contains all the data to be updated
     * @returns {object} the updated item or undefined if the update operation failed
     */
    async updatePiece(id, body, pool) {
        try {
            const { rows } = await pool.query('UPDATE project.piece SET name = $1, description = $2, artists = $3, signed = $4, partner = $5, collection = $6, type = $7, size = $8, art_movement = $9, location = $10, date = $11 WHERE id_auction = $12 RETURNING *',
                [body.name, body.description, body.artist, body.signed, body.partner, body.collection, body.type, body.size, body.art_movement, body.location, body.date, id]);

            if (! rows[0]) return;

            return rows[0];
        } catch (error){
            throw new Error(error);
        }
    }

}

module.exports = {Pieces};