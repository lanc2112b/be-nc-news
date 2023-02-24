const commentRouter = require("express").Router();

const {
  delCommentById
} = require("../controllers/commentController");

commentRouter.delete("/:comment_id", delCommentById);

module.exports = commentRouter;
