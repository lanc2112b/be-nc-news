const fs = require("fs/promises");

exports.readApiRoutes = () => {
  const filePath = './endpoints.json';

  return fs
    .readFile(filePath)
    .then((jsonObj) => {
      return JSON.parse(jsonObj);
    })
    .catch((error) => {
      return Promise.reject({ status: 500, msg: "Data retrieval issue" });
    });
};
