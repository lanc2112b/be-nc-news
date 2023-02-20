const db = require("../db/connection");

/** Imports & BP above here */

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
    .then((result) => {
      if (result.rowCount < 1) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return result.rows;
    })
    .catch((error) => {
      next(error);
    });
};
