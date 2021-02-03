const redis = require("redis");
const client = redis.createClient(`redis://localhost:6379`);
const logger = require("../logger").log;

function getObject(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        reject(err);
        return;
      }
      if (reply === undefined || reply === null) {
        logger.error("No such item in cache");
        resolve();
        return;
      }
      logger.info(`Data found in cache with key: ${key}`);
      resolve(JSON.parse(reply));
    });
  });
}

function get(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        reject(err);
        return;
      }
      if (reply === undefined || reply === null) {
        // reject(new Error("No such item"));
        logger.error("No such item in cache");
        return;
      }
      logger.info(`Data found in cache with key: ${key}`);
      resolve(reply);
    });
  });
}

function set(key, str) {
  client.set(key, str);
}

function setObject(key, val) {
  client.set(key, JSON.stringify(val));
}

function unset(key) {
  client.del(key);
}

const exportObj = {
  get,
  set,
  getObject,
  setObject,
  unset
};

module.exports = exportObj;
