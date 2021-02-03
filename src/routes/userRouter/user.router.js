/**
 * All the routes used for user
 */

const express = require("express");
const userHandler = require("../../handlers/user/user.handler");
const userRouter = express.Router();

const checkUserCache = require("../../cacheHelper/user");

const thisRoute = "/users";
userRouter
  .route(thisRoute)
  .get(userHandler.getAllUsers)
  .post(userHandler.createUser);

userRouter
  .route(`${thisRoute}/:id`)
  .all(checkUserCache.checkUser)
  .get(userHandler.getOneById)
  .put(userHandler.updateUser)
  .delete(userHandler.deleteOne);

module.exports = userRouter;
