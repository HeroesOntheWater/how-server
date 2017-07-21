import React, { Component } from 'react';
import request from 'superagent';
import Calendar from './calendar';
import moment from 'moment';

const defaultDate = (new Date()).valueOf();

class FileList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      app: this.props.location.state.app,
      version: this.props.location.state.version,
      token: this.props.location.state.token,
      begin: defaultDate,
      end: defaultDate,
      files: []
    };
  }

  handleBeginChange = (event) => {
    this.setState({begin: event.target.value});
  }

  handleEndChange = (event) => {
    this.setState({end: event.target.value});
  }

  handleBeginCallback = (timestamp) => {
    this.setState({begin: timestamp});
  }

  handleEndCallback = (timestamp) => {
    this.setState({end: timestamp});
  }

  handleSubmit = (event) => {
    var url = "http://localhost:8080/backup?token=" + this.state.token + "&app=" + this.state.app +
    "&version=" + this.state.version + "&fromDate=" + this.state.begin + "&toDate=" + this.state.end;
    request.get(url)
      .end((err, res) => {
          if (err) {
            alert('Error', err);
          } else {
            this.setState({files: res.body});
          }
        }
      );
    event.preventDefault();
  }

  handleDownload = (timestamp) => {
    var url = "http://localhost:8080/backup/download?token=" + this.state.token + "&app=" + this.state.app +
    "&version=" + this.state.version + "&timestamp=" + timestamp;
    request.get(url)
        .end((err, res) => {
            if (err) {
              console.log('Error', err);
            } else {
              window.open(url);
            }
        }
      );
  }

  render() {
    return (
      <div>
        <h3>Enter Time period</h3>
        <form onSubmit={this.handleSubmit}>
          <label>
          Beginning:
          <input value={moment(this.state.begin).format("MM/DD/YYYY hh:mm a")} onChange={this.handleBeginChange} type="text" />
          </label>
          <label>
          Ending:
          <input value={moment(this.state.end).format("MM/DD/YYYY hh:mm a")} onChange={this.handleEndChange} type="text" />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <ul>
          {this.state.files.map((timestamp) => (
            <li onClick={() => this.handleDownload(timestamp)} key={timestamp}>{timestamp}</li>
          ))}
        </ul>
        <Calendar callbackFromParent={this.handleBeginCallback} />
        <Calendar callbackFromParent={this.handleEndCallback}/>
      </div>
    );
  }
}

export default FileList;
