const { selectAllUsers } = require("../models/userModel");

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