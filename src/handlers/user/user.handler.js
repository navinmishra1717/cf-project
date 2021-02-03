const userService = require("../../services/user/user.service");
const logger = require("../../commons/logger");
const log = logger.log;
const redisHelper = require("../../commons/redisHelper");
const Response = require("../../commons/response");

/**
 * This function gets all the users in the system
 * @param {object} req request object
 * @param {object} res response object
 * @param {function} next function to call next middleware
 */
async function getUsers(req, res, next) {
  try {
    let query = { isDeleted: false };
    const users = await userService.get(query);
    log.info("Get users success");
    Response.successResponse(res, "Get users success", users);
  } catch (err) {
    log.error(err);
    next(err);
  }
}

/**
 * This function create the new user in the system
 * @param {object} req request object
 * @param {object} res response object
 * @param {function} next function to call next middleware
 */
async function createUser(req, res, next) {
  let user = req.body;
  try {
    log.info("creating new user");
    user.createdAt = Date.now();
    user.updatedAt = Date.now();
    const newUser = await userService.create(user);
    const msg = "user created successfully";
    log.info(msg);
    Response.successResponse(res, msg, newUser);
  } catch (err) {
    log.error(err);
    next(err);
  }
}

/**
 * This function updates the user with given id in the system
 * @param {object} req request object
 * @param {object} res response object
 * @param {function} next function to call next middleware
 */

async function updateUser(req, res, next) {
  const userId = req.params.id;
  const updateData = req.body;
  try {
    log.info(`updating user with id:${userId}`);
    const newUser = await userService.update(userId, updateData);
    // should update in cache too
    redisHelper.unset(userId);
    log.info(`Data updated in cache with key: ${userId}`);
    Response.successResponse(
      res,
      `update user success with id:${userId}`,
      newUser
    );
  } catch (err) {
    log.error(err);
    next(err);
  }
}

/**
 *
 * @param {object} req request object
 * @param {object} res response object
 * @param {function} next next function
 */

async function getOneById(req, res, next) {
  const id = req.params.id;
  try {
    const user = await userService.getOne(id);
    const msg = "Get user by id success!!";
    log.info(msg);
    // store in redis cache
    redisHelper.setObject(id, user);
    log.info(`Data sent to store in redis cache with id: ${id}`);
    Response.successResponse(res, msg, user);
  } catch (err) {
    log.error(err);
    next(err);
  }
}

/**
 *
 * @param {object} req request object
 * @param {object} res response object
 * @param {function} next next function
 */

async function deleteOne(req, res, next) {
  const userId = req.params.id;
  let userData;
  try {
    // check in cache first
    if (req.userCache) {
      userData = req.userCache;
      log.info("data taken from cache");
    } else {
      userData = await userService.getOne(userId, { isDeleted: false });
    }
    if (!userData) {
      return Response.errorResponse(res, "user not found");
    }
    await userService.deleteOne(userId, userData);
    const msg = "Delete user by id success!!";
    log.info(msg);
    // delete from cache too
    redisHelper.unset(userId);
    log.info(`Data deleted from cache with key: ${userId}`);
    Response.successResponse(res, msg);
  } catch (err) {
    log.error(err);
    next(err);
  }
}

const userHandler = {
  getAllUsers: getUsers,
  createUser: createUser,
  updateUser: updateUser,
  getOneById: getOneById,
  deleteOne: deleteOne
};

module.exports = userHandler;
