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

exports.selectAllArticles = (order = 'desc', sort = 'created_at', topic = null) => {
  
  // topic = topic column
  // sort_by = any column
  // default = created_at
  // order = asc / desc
  // default desc
  const validSortColumns = [
     "article_id",
     "title",
     "topic",
     "author",
     "body",
     "created_at",
     "votes",
     "article_image_url",
   ];
 
   const validOrderOptions = ["asc", "desc"];
 
   if (!validOrderOptions.includes(order.toLowerCase())) {
     return Promise.reject({ status: 400, msg: "Bad Request: order direction" });
   }
 
   if (sort && !validSortColumns.includes(sort.toLowerCase())) {
     return Promise.reject({ status: 400, msg: "Bad Request: sort by" });
   }

  const sortQuery = ` ORDER BY ${sort} ${order}`;

  const whereTopicQuery = topic ? ` WHERE topic = $1` : ``;

  const whereArray = topic ? [topic] : "";

  return db
    .query(
      `SELECT a.author, a.title, a.article_id, a.topic, 
        a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count
        FROM articles a
        LEFT JOIN comments c
        ON c.article_id = a.article_id
        ${whereTopicQuery}
        GROUP BY a.article_id
        ${sortQuery};`,
      whereArray
    )
    .then((result) => {
      if (result.rows < 1) {
        return Promise.reject({ status: 404, msg: "No Articles Found" });
      }
      return result.rows;
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