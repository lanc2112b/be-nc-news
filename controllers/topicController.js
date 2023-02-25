const { selectAllTopics, insertNewTopic } = require("../models/topicModel");

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

exports.postNewTopic = (request, response, next) => {

  const { slug, description } = request.body;
  //console.log(slug, description);
  insertNewTopic(slug, description)
    .then((result) => {
      response.status(201).send({ topic: result });
    })
    .catch((error) => {
      next(error);
    });

}