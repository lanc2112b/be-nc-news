const topicRouter = require("express").Router();

const { getTopics, postNewTopic } = require("../controllers/topicController");

topicRouter.get("/", getTopics);

topicRouter.post("/", postNewTopic);

module.exports = topicRouter;