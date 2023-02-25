const db = require("../db/connection");
const format = require("pg-format");
/** Imports & BP above here */

exports.selectArticleById = (id) => {
  return db
    .query(
      `SELECT a.author, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes, a.article_img_url,
          COUNT(c.comment_id) AS comment_count
        FROM articles a
        JOIN comments c
        ON c.article_id = a.article_id
        WHERE a.article_id = $1
        GROUP BY a.article_id;`,
      [id]
    )
    .then((result) => {
      if (result.rowCount < 1) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return result.rows[0];
    });
};

exports.selectAllArticles = (order = "desc", sort = "created_at", topic = null, limit = 10, page = 1) => {

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

  if (isNaN(limit)) {
    return Promise.reject({ status: 400, msg: "Bad Request: limit value type" });
  }

  if (isNaN(page)) {
    return Promise.reject({ status: 400, msg: "Bad Request: page value type" });
  }

  sort = sort.toLowerCase();

  if (sort && !validSortColumns.includes(sort)) {
    return Promise.reject({ status: 400, msg: "Bad Request: sort by" });
  }

  const sortQuery = ` ORDER BY ${sort} ${order}`;

  const whereTopicQuery = topic ? ` WHERE topic = $3` : ``;
  
  const limitStr = ` LIMIT $1`;
  
  const offsetStr = ` OFFSET $2`; 

  const offSetVal = page > 1 ? limit * (page - 1) : 0;
  
  const valsArray = [];

  valsArray.push(limit);
  valsArray.push(offSetVal);
  if (topic) {
    valsArray.push(topic);
  }

  return db
    .query(
      `SELECT a.author, a.title, a.article_id, a.topic, 
        a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count,
        count(*) OVER() AS total_count
         FROM articles a
        LEFT JOIN comments c
        ON c.article_id = a.article_id
        ${whereTopicQuery}
        GROUP BY a.article_id
        ${sortQuery}
        ${limitStr} ${offsetStr};`,
      valsArray
    )
    .then((result) => {
      if (result.rows < 1) {
        return Promise.reject({ status: 404, msg: "No Articles Found" });
      }
      return result.rows;
    });
};

exports.insertNewArticle = (author, title, content, topic, artImage = null) => {

  //username exists or wouldn't have got to here.
  if (!title) {
    return Promise.reject({ status: 400, msg: "Missing title" });
  }
  if (!content) {
    return Promise.reject({ status: 400, msg: "Missing content" });
  }
  if (!topic) {
    return Promise.reject({ status: 400, msg: "Missing topic" });
  }

  artImage =
    artImage ??
    "https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  // got this far? Great.

  return db
    .query(`INSERT INTO articles
            (author, title, topic, body, article_img_url)
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING *;`,
            [author, title, topic, content, artImage]
    )
    .then((result) => {
      // using the RETURNING *; comment_count will be 0 at this stage, set manually before returning.
      result.rows[0].comment_count = 0;
      return result.rows[0];
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
    });
};

exports.deleteArticleById = (id) => {

  if (id < 1) {
    return Promise.reject({ status: 400, msg: "Invalid type for article id" });
  }

  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Article id should be a number" });
  }

  return db.query(`DELETE FROM articles WHERE article_id = $1 RETURNING *;`, [id])
    .then((result) => {

      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Cannot find article with ID provided" });
      }
      return result.rows[0];
    });

}
