const {
  selectCommentsByArticleId,
  insertCommentByArtId,
} = require("../models/commentModel");

const { selectUsernameByName } = require('../models/userModel');

const { selectArticleById } = require('../models/articleModel');

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

  selectArticleById(article_id)
    .then((result) => {

      return selectUsernameByName(username);
    }) 
    .then((result) => { 

      return insertCommentByArtId(article_id, username, body);
    })
    .then((result) => {
      
      response.status(201).send({ comment: result });
    })
    .catch((error) => {
      next(error);
    });
}