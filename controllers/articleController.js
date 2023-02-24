const {
  selectArticleById,
  selectAllArticles,
  updateArticleById,
  insertNewArticle,
} = require("../models/articleModel");

const { selectUsernameByName } = require('../models/userModel');

exports.getArticleById = (request, response, next) => {
  
  const { article_id } = request.params;

  selectArticleById(article_id)
    .then((result) => {
      response.status(200).send({ article: result });
    })
    .catch((error) => {
      next(error);
    });
}

exports.getArticles = (request, response, next) => {

  const { order, sort_by, topic, limit, p } = request.query;

  selectAllArticles(order, sort_by, topic, limit, p)
    .then((results) => {
      response.status(200).send({ articles: results });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postNewArticle = (request, response, next) => {
  
  const { author, title, body, topic, article_img_url } = request.body;
  
  selectUsernameByName(author)
    .then((result) => {
      // if valid user, else already rejected
      /*** make a call to check & add topic if the supplied doesn't exist after 22-post-topics */
      return insertNewArticle(author, title, body, topic, article_img_url);
    })
    .then((result) => {
      response.status(201).send({ article: result });
    })
    .catch((error) => {
      next(error);
    });
}

exports.patchArticleById = (request, response, next) => {

  const { article_id } = request.params;

  const updateData = request.body;

    updateArticleById(article_id, updateData)
      .then((result) => {
        response.status(201).send({ article: result });
      })
      .catch((error) => {
        next(error);
      });
}