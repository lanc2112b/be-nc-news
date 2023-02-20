const { selectAllTopics } = require('../models/topicModel');

/** Imports & BP above here */

exports.getTopics = (request, response, next) => {

  selectAllTopics()
    .then((results) => {
    response.status(200).send({ topics: results });
    })
    .catch((error) => {
      next(error);
  });
}