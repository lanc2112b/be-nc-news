const express = require("express");
const app = express();
const cors = require('cors');

const apiRouter = require("./routes/api-router");

const { default404s, errorHandler400, errorHandler500 } = require("./controllers/errorHandlerController");

app.use(cors());
app.use(express.json());
app.use('/', apiRouter);
app.use('/api', apiRouter);

/** end routes */


/*
const allRoutes = [];
app._router.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    allRoutes.push(r.route.path);
  }
});
console.log(allRoutes);
*/

/** error handlers */
app.use(default404s);
app.use(errorHandler400);
app.use(errorHandler500);

module.exports = app;
