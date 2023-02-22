const {
  selectCommentsByArticleId,
  insertCommentByArtId,
  selectUsernameByName,
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

  if (!body) { // I ain't got no body..... badum tsh
    const error = { status: 400, msg: "No content provided" };
    next(error);
  } else if (!username) { // if your name ain't down your not comin' in!
    const error = { status: 400, msg: "No username provided" };
    next(error);
  }

  selectArticleById(article_id)
    .then((result) => {
      // if we have a result here, don't care, as it hasn't already been rejected
      // article must exist, so:
      // check for author next
      return selectUsernameByName(username); // return or reject in model
    }) 
    .then((result) => { 

      return insertCommentByArtId(article_id, username, body); // return or reject in model
    })
    .then((result) => {
      
      response.status(201).send({ comment: result[0] }); // respond with the newly inserted row.
    })
    .catch((error) => {
      next(error);
    });
}