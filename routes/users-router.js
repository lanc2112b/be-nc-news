const userRouter = require('express').Router();

const {
  getUsers,
  getUserByUsername,
} = require("../controllers/userController");

userRouter.get("/", getUsers);

userRouter.get("/:username", getUserByUsername);

module.exports = userRouter;