const express = require("express");
const app = express();

app.use(express.json());

const {
  default404s,
  errorHandler400,
  errorHandler500,
} = require("./controllers/errorHandlerController");
const { getTopics } = require("./controllers/topicController");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articleController");
const {
  getArtCommentsById,
  postArtCommentById,
} = require("./controllers/commentController");

/** Imports & BP above here */

/** routes */
app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArtCommentsById);

app.post("/api/articles/:article_id/comments", postArtCommentById);







/** Override default express html 404's */
app.use(default404s);
/** end routes */
/** error handlers */
app.use(errorHandler400);
app.use(errorHandler500);

module.exports = app;
