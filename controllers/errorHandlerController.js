exports.default404s = (request, response, next) => {
  response.status(404).send({ msg: 'Invalid path requested'});
}

exports.errorHandler400 = (error, request, response, next) => {
  if (error.code === '22P02') {

    response.status(400).send({ msg: "Invalid parameter type provided" });
  } else if (error.code === "23505") {

    response.status(400).send({ msg: `Duplicate entry: ${error.detail}` });
  } else {

    error.status && error.msg;
    response.status(error.status).send({ msg: error.msg });
  }
}

exports.errorHandler500 = (error, request, response, next) => {
  response.status(500).send({ msg: "Server Internal Error" });
}