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
      return result.rows[0];
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
  
  const { inc_votes } = update;

  if (id < 1) {
    return Promise.reject({ status: 400, msg: "Invalid type for article id" });
  }
    
  if (!update) {
    return Promise.reject({ status: 400, msg: "No data provided" });
  }

  if (update.hasOwnProperty("inc_votes") === false) {
    return Promise.reject({
      status: 400,
      msg: "Object does not contain correct key(s)",
    });
  } else if (typeof update.inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid value type in object" });
  }

  return db
    .query(
      `UPDATE articles
        SET
          votes = votes + $1            
        WHERE article_id = $2
        RETURNING *;`,
      [inc_votes, id]
    )
    .then((result) => {
      if (result.rows < 1) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return result.rows[0];
    })

}