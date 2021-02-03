const redisHelper = require("../commons/redisHelper");
const response = require("../commons/response");
const cacheUserObj = {};

cacheUserObj.checkUser = async (req, res, next) => {
  try {
    // check user data in cache for id first
    const id = req.params.id;
    const reply = await redisHelper.getObject(id);
    if (reply) {
      if (req.method === "GET") {
        response.successResponse(res, "getting response from cache!!", reply);
      } else if (req.method === "DELETE") {
        req.userCache = reply;
        next();
      }
    } else {
      // forward to api fetch
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = cacheUserObj;
