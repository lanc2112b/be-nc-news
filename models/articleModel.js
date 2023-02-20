const db = require('../db/connection');
























exports.selectArticleById = (id) => {

  return db.query(`SELECT author, title, article_id, body, topic, created_at, votes, article_img_url
                  FROM articles
                  WHERE article_id = $1`, [id])
    .then((result) => result.rows);
}













