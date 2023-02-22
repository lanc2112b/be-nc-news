const {
  selectCommentsByArticleId,
  insertCommentByArtId,
} = require("../models/commentModel");

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


exports.postArtCommentById = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;

  // Almost used the promise.all way from the getArtCommentsById method, however,
  // the row would've been inserted regardless, which is not what we want
  // Why allow commenting on a non existing article to be left with orphan comments???

  //const insertPromise = insertCommentByArtId(article_id, username, body);
  //const articlePromise = selectArticleById(article_id);

  selectArticleById(article_id)
    .then((result) => {
      // if we have a result here, don't care, as it hasn't already been rejected
      // article must exist, so:
      return insertCommentByArtId(article_id, username, body); //so not nesting then, sure there's a better way?
    }) // hmm more comments than code
    .then((result) => {
      response.status(201).send({ comment: result[0] }); // respond with the newly inserted row.
    })
    .catch((error) => {
      next(error);
    });
}