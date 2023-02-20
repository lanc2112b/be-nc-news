const express = require('express');
const app = express();
app.use(express.json());

const { getTopics } = require('./controllers/topicController');
const { getArticleById } = require('./controllers/articleController');
/** Imports & BP above here */

/** routes */
app.get('/api/topics', getTopics);









app.get('/api/articles/:article_id', getArticleById);
/** end routes */

module.exports = app;
