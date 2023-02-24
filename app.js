const express = require("express");
const app = express();

const apiRouter = require("./routes/api-router");

app.use(express.json());

const { getArtCommentsById, postArtCommentById, delCommentById } = require("./controllers/commentController");

const { default404s, errorHandler400, errorHandler500 } = require("./controllers/errorHandlerController");

/** Imports & BP above here */

/** routes */

app.use('/', apiRouter);
app.use('/api', apiRouter);

/*const allRoutes = [];
app._router.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    allRoutes.push(r.route.path);
  }
});
*/

/** end routes */
/** error handlers */
app.use(default404s);
app.use(errorHandler400);
app.use(errorHandler500);

module.exports = app;
