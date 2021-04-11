import { Input, Space, Typography } from "antd";
import ScrolledList from "./ScrolledList";
import "antd/dist/antd.css";
import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

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
      <img className="title" src="film_catcher_logo.png" alt="logo" />
      <Search
        className="input-field"
        placeholder="Let me catch your film!"
        allowClear
        enterButton="Catch"
        size="large"
        onSearch={handleSearch}
      />
      <div>
        {results.map((movie) => {
          return (
            <div key={movie.imdb_id}>
              <div>
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
              <div>{movie.factor * 100}</div>
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
