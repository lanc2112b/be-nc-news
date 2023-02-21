const express = require('express');
const app = express();

app.use(express.json());

const { errorHandler400, errorHandler500 } = require('./controllers/errorHandlerController');
const { getTopics } = require('./controllers/topicController');
const { getArticleById, getArticles } = require('./controllers/articleController');
const { getArtCommentsById } = require('./controllers/commentController');

/** Imports & BP above here */

/** routes */
app.get("/api/articles/:article_id/comments", getArtCommentsById);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get('/api/topics', getTopics);



app.use(errorHandler400);
app.use(errorHandler500);


/** end routes */

module.exports = app;
