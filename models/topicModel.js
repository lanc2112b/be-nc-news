const db = require('../db/connection');

/** Imports & BP above here */

exports.selectAllTopics = () => {
  
  return db.query(`SELECT slug, description FROM topics;`).then((result) => result.rows);

};

exports.insertNewTopic = (slug, description) => {

  if (!slug) {
    return Promise.reject({ status: 400, msg: "Slug not provided (required)" });
  }
  if (!description) {
    return Promise.reject({ status: 400, msg: "Description not provided (required)" });
  }
  // other error checks here, too long, etc
  return db.query(
    `INSERT INTO topics
              (slug, description)
              VALUES
              ($1, $2)
              RETURNING *;`,
    [slug, description])
    .then((result) => result.rows[0]);

  


};