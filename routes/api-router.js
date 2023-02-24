const apiRouter = require('express').Router();

const userRouter = require('./users-router');
const topicRouter = require('./topics-router');
const articleRouter = require('./articles-router');
const commentRouter = require('./comments-router');

const { getApiRoutes } = require('../controllers/apiRouteController');

apiRouter.get('/', (request, response) => {
  response.status(200).send({ msg: "API Running, use /api to see endpoints." });
});

apiRouter.get("/api", getApiRoutes);

apiRouter.use('/users', userRouter);

apiRouter.use("/topics", topicRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;