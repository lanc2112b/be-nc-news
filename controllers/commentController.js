const {selectCommentsByArticleId} = require('../models/commentModel');

/** hmmm, comments belong to articles, should possibly be part of articles?  */

exports.getArtCommentsById = (request, response, next) => {

  const { article_id } = request.params;

  selectCommentsByArticleId(article_id)
    .then((result) => {
      response.status(200).send({ comments: result });
    })
    .catch((error) => {
      next(error);
    });
};
