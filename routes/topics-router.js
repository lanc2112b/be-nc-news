const topicRouter = require("express").Router();

const { getTopics } = require("../controllers/topicController");

topicRouter.get("/", getTopics);

module.exports = topicRouter;