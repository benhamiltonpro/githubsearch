import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import RepoSearch from "./pages/Search";
import RepoDetails from "./pages/RepoDetails";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Repo Details Page */}
        <Route path="/details/:id" children={<RepoDetails />} />
        {/* Search Page */}
        <Route path="/">
          <RepoSearch />
        </Route>
      </div>
    </Router>
  );
}

export default App;
