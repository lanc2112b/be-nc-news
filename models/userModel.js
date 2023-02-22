const db = require('../db/connection');

/** Imports & BP above here */

exports.selectAllUsers = () => {
  
  return db
  .query(`SELECT * FROM users;`).then((result) => result.rows);
}