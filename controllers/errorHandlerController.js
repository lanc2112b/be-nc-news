exports.errorHandler500 = (error, request, response, next) => {
  response.status(500).send({ msg: "Server Internal Error" });
};

exports.errorHandler400 = (error, request, response, next) => {
  if (error.code === '22P02') {
    response.status(400).send({ msg: "Invalid type for article id" });
  } else if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  }
};
