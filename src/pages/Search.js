import React, { useState } from "react";
import {
  TiArrowUnsorted,
  TiArrowSortedDown,
  TiArrowSortedUp,
} from "react-icons/ti";
import {
  Button,
  InputGroup,
  DropdownButton,
  Dropdown,
  Spinner,
  Alert
} from "react-bootstrap";
import { useHistory } from "react-router-dom";

import api from "../api";
import { sortByProperty } from "../utils";
import "./Search.css";

/** Header Column displays the table header and allows for sorting if enabled with callback */
const HeaderColumn = ({ name, sortable, sortCallback, direction }) => {
  let sortDisplay = sortable ? <TiArrowUnsorted /> : null;
  if (sortable && direction !== null) {
    sortDisplay =
      direction === "asc" ? <TiArrowSortedUp /> : <TiArrowSortedDown />;
  }
  return (
    <div
      className={sortable ? "sortableHeader" : "rowInfo"}
      onClick={sortCallback}
    >
      {name}
      {sortDisplay}
    </div>
  );
};

/** Table Row displays the repo information for the table display */
const TableRow = ({ item }) => {
  let history = useHistory();
  return (
    <div
      className="rowItem"
      onClick={() => history.push(`/details/${item.id}`, item)}
    >
      <div className="rowInfo">{item.score}</div>
      <div className="rowInfo">{item.name}</div>
      <div className="rowInfo">{item.description}</div>
      <div className="rowInfo">{item.stargazers_count}</div>
      <div className="rowInfo">{item.language}</div>
      <div className="rowInfo">{(item.owner || {}).login}</div>
    </div>
  );
};

function Search() {
  const [results, setResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState(new URLSearchParams());
  const [scoreSortDirection, setScoreSortDirection] = useState(null);
  const [starSortDirection, setStarSortDirection] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loading, setLoading] = useState(false);

  /** Adds or updates query param */
  const upsertQueryParam = (name, value) => {
    let queryCopy = query;
    if (queryCopy.get(name)) queryCopy.delete(name);
    queryCopy.append(name, value);
    setQuery(queryCopy);
  };
  /** Removes query param */
  const removeQueryParam = (name) => {
    let queryCopy = query;
    if (queryCopy.get(name)) queryCopy.delete(name);
    setQuery(queryCopy);
  };
  /** Determines what the next state of the tri-state sort value should be */
  const handleSort = (sortDirection, setSortDirection) => {
    let newDirection = null;
    if (sortDirection === null) {
      newDirection = "asc";
    } else if (sortDirection === "asc") {
      newDirection = "desc";
    }
    setSortDirection(newDirection);
    return newDirection;
  };
  /** Sorts based on score. This will cause the state list to be altered on render. Api does not support score sorting. */
  const handleScoreSort = (direction) => {
    handleSort(scoreSortDirection, setScoreSortDirection);
    setStarSortDirection(null);
  };
  /** Sorts based on stars. This will re-query the api to sort based on stars */
  const handleStarsSort = (direction) => {
    const newDirection = handleSort(starSortDirection, setStarSortDirection);
    if (newDirection === null) {
      removeQueryParam("sort");
      removeQueryParam("order");
    } else {
      upsertQueryParam("sort", "stars");
      upsertQueryParam("order", newDirection);
    }
    setScoreSortDirection(null);
    getRepos();
  };
  /** Handles error from api and displays a user friendly retry message while console logging the error for support */
  const handleApiError = (errorMessage) => {
    setLoading(false);
    console.log(errorMessage); // not exposing detailed error to user on front end
    setMessage(
      "There was an issue searching the repos. Please wait and try again later."
    );
  };
  /** Queries the api for repos with query params for search, sort, and order */
  const getRepos = () => {
    setLoading(true);
    setMessage(""); // reset message
    api(`repos?${query.toString()}`)
      .then((temp2) => {
        const { message: gitMessage, items } = temp2 || {};
        /* Takes the results and maps them to a unique language array for filtering */
        if (gitMessage) {
          // handle error coming from github response
          handleApiError(gitMessage);
        } else {
          // no error from github
          const languages = items
            .map((x) => x.language)
            .filter((val, index, a) => a.indexOf(val) === index);

          setResults(items);
          setLanguages(languages);
          setLoading(false);
        }
      })
      .catch((e) => {
        handleApiError(e.message);
      });
  };
  /** Calls get repos with the current search value */
  const searchRepos = () => {
    if (!searchValue && searchValue.trim()) return;
    upsertQueryParam("q", searchValue);
    getRepos();
  };

  /* Take the state value for results and manipulate it if there is a sort applied or a filter applied */
  let sortedItems = results;
  if (scoreSortDirection !== null) {
    sortedItems = sortByProperty(sortedItems, "score");
    if (scoreSortDirection === "desc") {
      sortedItems = sortedItems.reverse();
    }
  }
  if (selectedLanguage !== null) {
    sortedItems = sortedItems.filter((x) => x.language === selectedLanguage);
  }
  return (
    <div>
      <h1 className="pt-1">Git Repo Search</h1>
      {message.length ? <Alert variant="warning">{message}</Alert> : null}
      <div>
        <InputGroup className="mb-3 pt-3 d-flex justify-content-center">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="search for repo..."
            disabled={loading}
          />
          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              onClick={searchRepos}
              disabled={loading || searchValue.length < 1}
            >
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : null}
              Search
            </Button>
          </InputGroup.Append>
          {languages && languages.length ? (
            <DropdownButton
              as={InputGroup.Append}
              variant="outline-primary"
              id="dropdown-item-button"
              title={
                selectedLanguage === null ? "All Languages" : selectedLanguage
              }
              disabled={loading}
            >
              <Dropdown.Item
                as="button"
                onClick={() => setSelectedLanguage(null)}
              >
                All Languages
              </Dropdown.Item>
              {languages.map((x) => (
                <Dropdown.Item
                  as="button"
                  onClick={() => setSelectedLanguage(x)}
                  key={x}
                >
                  {x}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          ) : null}
        </InputGroup>
      </div>
      {sortedItems && sortedItems.length ? (
        <div className="rowBody">
          <div className="rowHeader">
            <HeaderColumn
              name="Relevance"
              sortable
              sortCallback={handleScoreSort}
              direction={scoreSortDirection}
            />
            <HeaderColumn name="Name" />
            <HeaderColumn name="Description" />
            <HeaderColumn
              name="Stars"
              sortable
              sortCallback={handleStarsSort}
              direction={starSortDirection}
            />
            <HeaderColumn name="Language" />
            <HeaderColumn name="Owner" />
          </div>
          {sortedItems.map((item) => (
            <TableRow item={item} key={item.id} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Search;
