/** Adds query param to query string and prepends '?' if the query string is new */
const addQueryParam = function (query, param) {
  if (query === null || typeof query === "undefined") {
    throw "query cannot be null or undefined";
  }
  if (!(param || "").length) {
    throw "param is required";
  }
  let result = query;

  if (!(result.indexOf("?") === 0)) {
    result = `?${param}`;
  } else {
    result = `${result}&${param}`;
  }
  return result;
};
module.exports = {
  addQueryParam,
};
