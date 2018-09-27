const queries = require("dom-testing-library/dist/queries");
const { waitFor } = require("./wait-for");

const asyncQueries = Object.entries(queries).reduce((res, [fnName, fn]) => {
  if (fnName.startsWith("getAll")) {
    const asyncName = "findAll" + fnName.split("getAll")[1];
    res[asyncName] = waitFor(fn);
  } else if (fnName.startsWith("get")) {
    const asyncName = "find" + fnName.split("get")[1];
    res[asyncName] = waitFor(fn);
  }
  return res;
}, {});

module.exports = {
  ...asyncQueries,
};
