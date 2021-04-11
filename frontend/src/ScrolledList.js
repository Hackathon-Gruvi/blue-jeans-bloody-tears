import React from "react";
import "./ScrolledList.css";
import { List, Avatar, Spin } from "antd";

// const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

class ScrolledList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.results,
    };
  }

  render() {
    return (
      <>
        {/* <div className="demo-infinite-container">
          <List
            dataSource={this.state.data}
            renderItem={(item) => (
              <List.Item key={item.imdb_id}>
                <div>
                  <div className="title">
                    <a
                      href={`https://www.imdb.com/title/${item.imdb_id}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.title}
                    </a>
                  </div>
                  <div className="year">{item.year}</div>
                </div>
                <div>{item.factor * 100}</div>
              </List.Item>
            )}
          >
            {this.state.loading && this.state.hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </div> */}
        <div>
          {this.state.data &&
            this.state.data.forEach((movie) => {
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
      </>
    );
  }
}

export default ScrolledList;
