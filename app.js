const express = require('express');
const app = express();
app.use(express.json());

const { getTopics } = require('./controllers/topicController');
const { getArticles } = require('./controllers/articleController');
/** Imports & BP above here */

/** routes */

app.get('/api/articles', getArticles);

app.get('/api/topics', getTopics);












/** end routes */

module.exports = app;
