const db = require('../db/connection');

/** Imports & BP above here */

exports.selectAllUsers = () => {
  
  return db
  .query(`SELECT * FROM users;`).then((result) => result.rows);
}

exports.selectUsernameByName = (username) => {

  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then((result) => {
      
      if (result.rows < 1) {
        return Promise.reject({ status: 404, msg: "Username not found" });
      }
      return result.rows[0];
    });
};