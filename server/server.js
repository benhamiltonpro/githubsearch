const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const apicache = require("apicache");

const utils = require("./utils");

const app = express();
const cache = apicache.middleware;

const gitHubUrl = "https://api.github.com/search/repositories";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Node endpoint to get call the github repo with 5 minute caching to prevent unecessary calls to github */
app.get("/api/repos", cache("5 minutes"), async (req, res) => {
  try {
    const { q, sort, order } = req.query || {};
    let query = "";
    if (q && q.trim()) {
      query = utils.addQueryParam(query, `q=${q}`);
    }
    if (sort && sort.trim()) {
      query = utils.addQueryParam(query, `sort=${sort}`);
    }
    if (order && order.trim()) {
      query = utils.addQueryParam(query, `order=${order}`);
    }
    const url = `${gitHubUrl}${query}`;
    const response = await fetch(url);
    const result = await response.json();
    res.send(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.listen(process.env.PORT || 5000);
