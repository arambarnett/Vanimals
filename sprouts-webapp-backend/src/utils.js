const { customAlphabet } = require("nanoid");
const Avatar = require("avatar-builder");
const Sentry = require("@sentry/node");

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 13);

const captureAndReportEvent = (...params) => {
  /* eslint-disable-next-line no-console */
  console.error(...params);
  Sentry.captureException(...params);
  return Sentry.flush();
};

const captureAndReportException = (...params) => {
  /* eslint-disable-next-line no-console */
  console.error(...params);
  Sentry.captureException(...params);
  return Sentry.flush();
};

const sleepSeconds = (s) => new Promise((res) => {
  setTimeout(res, s * 1000);
});

const parseJSONOrNull = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return null;
  }
};

const randomFrom = (array) => array[Math.floor(Math.random() * array.length)];

const normalizeUsername = (username) => (
  username
    .normalize("NFD")
    .replace(/[\u0300-\u036f]|\s|[\W_]+/g, "")
    .toLowerCase()
);
/*
 * Prefixed id's such as bl_1jEserS are easier to read
 * and they make the client side linkage possible.
 * Using client side ids you can save round trips to the database
 * by inserting all elements at once.
 * In production, the id's length should be such according to the concurrency
 * of the table
*/
const createPrefixedId = (prefix) => `${prefix}_${nanoid()}`;

const generateRandomAvatar = (seed) => Avatar.identiconBuilder(64).create(seed);

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const pushIf = (condition, ...elements) => (condition ? elements : []);

module.exports = {
  captureAndReportException,
  captureAndReportEvent,
  generateRandomAvatar,
  normalizeUsername,
  createPrefixedId,
  parseJSONOrNull,
  sleepSeconds,
  randomFrom,
  capitalize,
  nanoid,
  pushIf,
};
