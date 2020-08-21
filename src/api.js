/** Queries the node api with a given url and optional parameters. */
const api = async (url, method = "GET", headers, body) => {
  const response = await fetch(`/api/${url}`, {
    method,
    headers,
    body,
  });
  const results = await response.json();

  if (response.status !== 200) {
    throw Error(results.message);
  }

  return results;
};
 export default api;