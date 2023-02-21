const {selectCommentsByArticleId} = require('../models/commentModel');
const { selectArticleById } = require('../models/articleModel');

/** hmmm, comments belong to articles, should possibly be part of articles?  */

exports.getArtCommentsById = (request, response, next) => {

  const { article_id } = request.params;

  const commentsPromise = selectCommentsByArticleId(article_id);
  const articlePromise = selectArticleById(article_id);

  Promise.all([commentsPromise, articlePromise])
    .then(([comments]) => {

      response.status(200).send({ comments: comments });
    })
    .catch((error) => {
      next(error);
    });
};
