const userRouter = require('express').Router();

const { getUsers } = require("../controllers/userController");

userRouter.get("/", getUsers);


module.exports = userRouter;