const express = require("express");
const app = express();

app.use(express.json());

const { getTopics } = require('./controllers/topicController');
const { getUsers } = require('./controllers/userController');
const { getArticleById,  getArticles,  patchArticleById } = require("./controllers/articleController");
const { getArtCommentsById, postArtCommentById } = require("./controllers/commentController");
const { default404s, errorHandler400, errorHandler500 } = require("./controllers/errorHandlerController");

/** Imports & BP above here */

/** routes */
app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArtCommentsById);

app.post("/api/articles/:article_id/comments", postArtCommentById);

app.get('/api/articles/:article_id', getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

/** end routes */
/** error handlers */
app.use(default404s);
app.use(errorHandler400);
app.use(errorHandler500);

module.exports = app;
