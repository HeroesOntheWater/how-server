import React, { Component } from 'react';
import request from 'superagent';
import createBrowserHistory  from 'history/createBrowserHistory';

const history = createBrowserHistory ({
  forceRefresh: true
});

class FileList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      app: this.props.location.state.app,
      version: this.props.location.state.version,
      token: this.props.location.state.token,
      begin: '',
      end: '',
      files: []
    };

    this.handleBeginChange = this.handleBeginChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }

  handleBeginChange(event) {
    this.setState({begin: event.target.value});
  }

  handleEndChange(event) {
    this.setState({end: event.target.value});
  }

  handleSubmit(event) {
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

  handleDownload(timestamp) {
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
    )
  }

  render() {
    return (
      <div>
        <h3>Enter Time period</h3>
        <form onSubmit={this.handleSubmit}>
          <label>
          Beginning:
          <input value={this.state.begin} onChange={this.handleBeginChange} type="text" />
          </label>
          <label>
          Ending:
          <input value={this.state.end} onChange={this.handleEndChange} type="text" />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <ul>
          {this.state.files.map((timestamp) => (
            <li onClick={() => this.handleDownload(timestamp)} key={timestamp}>{timestamp}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default FileList;
