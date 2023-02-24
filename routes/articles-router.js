const articleRouter = require("express").Router();

const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("../controllers/articleController");

const {
  getArtCommentsById,
  postArtCommentById,
} = require("../controllers/commentController");

articleRouter.get("/", getArticles);

articleRouter.get("/:article_id", getArticleById);

articleRouter.get("/:article_id/comments", getArtCommentsById);

articleRouter.post("/:article_id/comments", postArtCommentById);

articleRouter.patch("/:article_id", patchArticleById);

module.exports = articleRouter;
