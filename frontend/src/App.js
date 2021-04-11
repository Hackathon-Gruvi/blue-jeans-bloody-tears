import { Input, Space, Typography } from 'antd';
import ScrolledList from "./ScrolledList";
import 'antd/dist/antd.css';
import './App.css';
import reqwest from 'reqwest';
import React from 'react';

const { Search } = Input;
const { Title } = Typography;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(value) {
    this.setState({ value });
    console.log(value);
  }

  render() {
    return (
      <div className="App">
        <img className="title" src="film_catcher_logo.png" alt="logo" />
        <Search
          className="input-field"
          placeholder="Let me catch your film!"
          allowClear
          enterButton="Catch"
          size="large"
          onSearch={this.handleSearch}
        />
        { this.state.value.length == 0 ? null : <ScrolledList className="scroll-list" />}
        <div class="logos">
          <img src="https://ni.fe.up.pt/images/logo-niaefeup.png" alt="niaefeup" height="80" />
          <img src="https://gruvi-player-ss.s3.amazonaws.com/gruvi-logo-blue+500x270.png" alt="gruvi" height="80" />
        </div>
      </div>
    );
  }
}

export default App;
