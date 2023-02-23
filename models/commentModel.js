const db = require("../db/connection");

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
      return result.rows;
    });
};

exports.insertCommentByArtId = (id, author, body) => {
  if (!body) {
    return Promise.reject({ status: 400, msg: "No content provided" });
  }

  return db
    .query(
      `INSERT INTO comments 
        (article_id, author, body)
        VALUES 
        ($1, $2, $3)
        RETURNING *;`,
      [id, author, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.deleteCommentById = (id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [id])
    .then((result) => {
      // console.log(result)
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Cannot find article with ID provided" });
      }
      return result.rows[0];
    });
}
