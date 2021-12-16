"use strict";
const { parse, serialize } = require("../utils/json");
var escape = require("escape-html");

const jsonDbPath = __dirname + "/../data/users.json";

// Defaults data
const defaultItems = [
  {
    id: 1,
    nom_annonce: "Test",
    description: "Voir si ça fonctionne",
    prix_depart: 200,
    duree: 120,
    date_heure_debut: "heuuuuum ?",
    status: "En cours",
    proprietaire: "Admins",
    photo_couverture: "vouiii",
  },
]

class Annonces {
  constructor(dbPath = jsonDbPath, items = defaultItems) {
    this.jsonDbPath = dbPath;
    this.defaultItems = items;
  }

  getNextId() {
    const items = parse(this.jsonDbPath, this.defaultItems);
    let nextId;
    if (items.length === 0) nextId = 1;
    else nextId = items[items.length - 1].id + 1;

    return nextId;
  }

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
  // getOne(id) {
  //   const items = parse(this.jsonDbPath, this.defaultItems);
  //   const foundIndex = items.findIndex((item) => item.id == id);
  //   if (foundIndex < 0) return;
  //
  //   return items[foundIndex];
  // }

  /**
   * Returns the item identified by email
   * @param {string} email - email of the item to find
   * @returns {object} the item found or undefined if the email does not lead to a item
   */
  // getOneByEmail(email) {
  //   const items = parse(this.jsonDbPath, this.defaultItems);
  //   const foundIndex = items.findIndex((item) => item.email == email);
  //   if (foundIndex < 0) return;
  //
  //   return items[foundIndex];
  // }

  /**
   * Add a item in the DB and returns - as Promise - the added item (containing a new id)
   * @param {object} body - it contains all required data to create a item
   * @returns {Promise} Promise reprensents the item that was created (with id)
   */
  async addOne(body) {
    const items = parse(this.jsonDbPath, this.defaultItems);

    const newitem = {
      id: this.getNextId(),
      nom_annonce: escape(body.nom_annonce),
      description: escape(body.description),
      prix_depart: escape(body.prix_depart),
      duree: escape(body.duree),
      date_heure_debut: escape(body.date_heure_debut),
      status: "En cours",
      proprietaire: null, // TODO : Encore voir comment récup l'utilisateur
      photo_couverture: null, // TODO : Voir aussi comment le recup
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
    const updateditem = {...items[foundIndex], ...body};
    // replace the item found at index : (or use splice)
    items[foundIndex] = updateditem;

    serialize(this.jsonDbPath, items);
    return updateditem;
  }
}

module.exports = { Annonces };
