const { selectArticleById, selectAllArticles, updateArticleById  } = require('../models/articleModel');
/** Imports & BP above here */

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

  selectArticleById(article_id)
    .then((result) => {
      // We never get here if there's no article or the user input is wrong
      // they've already had a 400 styly response.
      const votesCount = result[0].votes;
      updateData.votes = votesCount + updateData.inc_votes;
      delete updateData.inc_votes;
      // maybe pass the whole modified result through at some point
      // but for now, modify the shortest data we have. 
    return updateArticleById(article_id, updateData);
  }).then((result) => { 

    response.status(201).send({ article: result[0] });
  })
    .catch((error) => {
      next(error);
    });
}