const { selectAllArticles } = require("../models/articleModel");

/** Imports & BP above here */

exports.getArticles = (request, response, next) => {
  selectAllArticles()
    .then((results) => {
      response.status(200).send({ articles: results });
    })
    .catch((error) => {
      next(error);
    });
};
