const articleRouter = require("express").Router();

const {
  getArticleById,
  getArticles,
  patchArticleById,
  postNewArticle,
  delArticleById,
} = require("../controllers/articleController");

const {
  getArtCommentsById,
  postArtCommentById,
} = require("../controllers/commentController");

articleRouter.get("/", getArticles);

articleRouter.get("/:article_id", getArticleById);

articleRouter.post("/", postNewArticle);

articleRouter.patch("/:article_id", patchArticleById);

articleRouter.get("/:article_id/comments", getArtCommentsById);

articleRouter.post("/:article_id/comments", postArtCommentById);

articleRouter.delete("/:article_id", delArticleById);

module.exports = articleRouter;
