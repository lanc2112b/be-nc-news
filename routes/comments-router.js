const commentRouter = require("express").Router();

const {
  delCommentById,
  patchCommentById,
} = require("../controllers/commentController");

commentRouter.patch("/:comment_id", patchCommentById);

commentRouter.delete("/:comment_id", delCommentById);

module.exports = commentRouter;
