const {readApiRoutes} = require('../models/apiRouteModel')


exports.getApiRoutes = (request, response, next) => {
  // Go to model, read file.
  // querying app._route.stack won't give us the fancy descriptions.

  readApiRoutes().then((result) => {

    response.status(200).send({ endpoints: result });
    
  });
};