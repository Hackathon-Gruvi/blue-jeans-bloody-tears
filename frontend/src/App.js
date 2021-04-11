import { Input } from "antd";
import "antd/dist/antd.css";
import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./film_catcher_logo.png";

const { Search } = Input;

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (value) => {
    setQuery(value);
  };

  const getResults = () =>
    new Promise((resolve, reject) => {
      if (query.length === 0) resolve([]);

      const options = {
        method: "GET",
        url: `http://localhost:5000/api/match`,
        params: { q: query },
        headers: { "Access-Control-Allow-Origin": "*" },
      };

      axios
        .request(options)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error: " + error);
          resolve([]);
        });
    });

  useEffect(() => {
    Promise.all([getResults()]).then((data) => {
      console.log("Results:");
      console.log(data.flat());
      setResults(data.flat());
    });
  }, [query]);

  return (
    <div className="App">
      <img className="title-film" src={logo} alt="logo" />
      <Search
        className="input-field"
        placeholder="Let me catch your film!"
        allowClear
        enterButton="Catch"
        size="large"
        onSearch={handleSearch}
      />
      <div className="list-items">
        {query.length > 0 && results.length === 0 && <p>Loading...</p>}
        {results.length > 0 &&
          results.map((movie) => {
            return (
              <div className="item" key={movie.imdb_id}>
                <div className="info">
                  <div className="title">
                    <a
                      href={`https://www.imdb.com/title/${movie.imdb_id}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {movie.title}
                    </a>
                  </div>
                  <div className="year">{movie.year}</div>
                </div>
                <div className="factor">{`${(movie.factor * 100).toFixed(
                  2
                )}%`}</div>
              </div>
            );
          })}
      </div>
      <div className="logos">
        <img
          src="https://ni.fe.up.pt/images/logo-niaefeup.png"
          alt="niaefeup"
          height="80"
        />
        <img
          src="https://gruvi-player-ss.s3.amazonaws.com/gruvi-logo-blue+500x270.png"
          alt="gruvi"
          height="80"
        />
      </div>
    </div>
  );
}

export default App;
