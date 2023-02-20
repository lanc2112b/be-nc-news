const db = require('../db/connection');

/** Imports & BP above here */

exports.selectAllTopics = () => {
  
  return db.query(`SELECT slug, description FROM topics;`).then((result) => result.rows);

};