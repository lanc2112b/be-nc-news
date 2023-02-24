const {
  selectAllUsers,
  selectUsernameByName,
} = require("../models/userModel");

/** Imports & BP above here */

exports.getUsers = (request, response, next) => { 

  selectAllUsers()
    .then((results) => {
      response.status(200).send({ users: results });
    })
    .catch((error) => {
      next(error);
    });
}

exports.getUserByUsername = (request, response, next) => {

  const { username } = request.params;

  selectUsernameByName(username)
    .then((result) => {
      response.status(200).send({ user: result });
    })
    .catch((error) => {
      next(error);
    });
}