const { selectArticleById, selectAllArticles, updateArticleById  } = require('../models/articleModel');
/** Imports & BP above here */
//const { selectArticleById, selectAllArticles  } = require('../models/articleModel'); //merge conf

exports.getArticleById = (request, response, next) => {
  
  const { article_id } = request.params;

  selectArticleById(article_id)
    .then((result) => {
      response.status(200).send({ article: result[0] });
    })
    .catch((error) => {
      next(error);
    });
}

exports.getArticles = (request, response, next) => {
  selectAllArticles()
    .then((results) => {
      response.status(200).send({ articles: results });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchArticleById = (request, response, next) => {

  const { article_id } = request.params;

  const updateData = request.body;

    updateArticleById(article_id, updateData)
      .then((result) => {
        response.status(201).send({ article: result[0] });
      })
      .catch((error) => {
        next(error);
      });
}