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

exports.insertCommentByArtId = (id, author, body) => {
  //console.log(body, "No Boddddddddy");
  //console.log(author, "No Boddddddddy");
  //console.log(id, "No Boddddddddy");
  if (!body) {
    // I ain't got no body..... badum tsh
    console.log(body, "No Boddddddddy");
    return Promise.reject({ status: 400, msg: "No content provided" });
    //const error = { status: 400, msg: "No content provided" };
    // next(error);
  } //else if (!author) {
    // if your name ain't down your not comin' in!
    //return Promise.reject({ status: 400, msg: "No username provided" });
    //const error = { status: 400, msg: "No username provided" };
   // next(error);
 // }

  return db
    .query(
      `INSERT INTO comments 
        (article_id, author, body)
        VALUES 
        ($1, $2, $3)
        RETURNING *;`,
      [id, author, body]
    )
    .then((result) => result.rows);
}

// strictly a user model check TODO: move to user model in t09 after PR resolves
exports.selectUsernameByName = (username) => {
  return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
      if (result.rows < 1) {
        return Promise.reject({status: 400, msg: 'Bad username'});
      }
      return result.rows;
    });
}
