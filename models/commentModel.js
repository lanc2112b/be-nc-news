const db = require("../db/connection");

exports.selectCommentsByArticleId = (id, limit = 10, page = 1) => {
  
  if (isNaN(limit)) {
    return Promise.reject({ status: 400, msg: "Bad Request: limit value type" });
  }

  if (isNaN(page)) {
    return Promise.reject({ status: 400, msg: "Bad Request: page value type" });
  }
  
  const limitStr = ` LIMIT $2`;

  const offsetStr = ` OFFSET $3`; 

  const offSetVal = page > 1 ? limit * (page - 1) : 0;

  const valsArray = [id];

  valsArray.push(limit);
  valsArray.push(offSetVal);

  return db
    .query(
      `SELECT comment_id, author, votes, created_at, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC
        ${limitStr} ${offsetStr};`,
      valsArray
    )
    .then((result) => {
      if (result.rows < 1) {
        return Promise.reject({ status: 404, msg: "No Comments Found" });
      }
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


exports.updateCommentById = (id, update) => {
  /** Extract to validation helper, pretty much the same code for article & comment required */
  const { inc_votes } = update;

  if (id < 1) {
    return Promise.reject({ status: 400, msg: "Invalid type for comment id" });
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
      `UPDATE comments
        SET
          votes = votes + $1            
        WHERE comment_id = $2
        RETURNING *;`,
      [inc_votes, id]
    )
    .then((result) => {
      if (result.rows < 1) {
        return Promise.reject({ status: 404, msg: "Comment Not Found" });
      }
      return result.rows[0];
    });
};






exports.deleteCommentById = (id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [id])
    .then((result) => {

      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Cannot find article with ID provided" });
      }
      return result.rows[0];
    });
}
