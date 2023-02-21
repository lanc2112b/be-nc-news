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
      /* Should return empty array, no reject */

      return result.rows;
    });
};

exports.insertCommentByArtId = (id, author, comment) => {

  return db
    .query(`INSERT INTO comments 
        (article_id, author, body)
        VALUES 
        ($1, $2, $3)
        RETURNING *;`, [id, author, comment])
    .then((result) => result.rows);
}
