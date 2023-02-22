const db = require('../db/connection');
const format = require('pg-format');
/** Imports & BP above here */

exports.selectArticleById = (id) => {

  return db.query(`SELECT author, title, article_id, body, topic, created_at, votes, article_img_url
                  FROM articles
                  WHERE article_id = $1 ;`, [id])
    .then((result) => {

      if (result.rowCount < 1) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }

      return result.rows;
    });
}

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT a.author, a.title, a.article_id, a.topic, 
        a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count
        FROM articles a
        JOIN comments c
        ON c.article_id = a.article_id
        GROUP BY a.article_id
        ORDER BY a.created_at DESC;`
    )
    .then((result) => result.rows )
    .catch((error) => {

      next(error);
    });
};

exports.updateArticleById = (id, update) => {
  
  // prep data update
  const nestedUpdates = [];
  // create each [ "IDENT/COL = DATA", key, val] AS [inc_votes = 2] via 'format'
  for (let key in update) {
    nestedUpdates.push(format("%I = %L", key, update[key]));
  }
  
  let setStrings = nestedUpdates.join(",");

  const queryString = format(
    `UPDATE articles a
     SET
     %s            
    WHERE a.article_id = %L
    RETURNING *;`,
    setStrings,
    id
  );

  return db.query(queryString).then((result) => result.rows);
}