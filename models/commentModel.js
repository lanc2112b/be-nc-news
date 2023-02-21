const db = require("../db/connection");
/** Imports & BP above here */

exports.selectCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT comment_id, author, votes, created_at, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`,
      [id]
    )
    .then((result) => {
      if (result.rowCount < 1) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }

      return result.rows;
    });
};
