import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FiArrowLeft } from "react-icons/fi";

import "./RepoDetails.css";

/** Repo Details displays the detailed information for that repo based on what was passed to it via react-router history state */
function RepoDetails() {
  let history = useHistory();

  const { location } = history;
  const { state } = location;
  return (
    <div className="wrapper">
      <div className="backWrapper">
        <Button
          variant="light"
          onClick={() => history.goBack()}
          title="go back"
        >
          <FiArrowLeft size="1.5rem" />
        </Button>
      </div>
      <div className="detailsWrapper">
        <h1>Repo Details</h1>
        <div><strong>Name:</strong> {state.name}</div>
        <div><strong>Description:</strong> {state.description}</div>
        <div><strong>Stars:</strong> {state.stargazers_count}</div>
        <div><strong>Language:</strong> {state.language}</div>
        <div><strong>Owner:</strong> {(state.owner || {}).login}</div>
      </div>
    </div>
  );
}

export default RepoDetails;
