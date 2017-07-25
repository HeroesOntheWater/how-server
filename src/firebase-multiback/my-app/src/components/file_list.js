import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import request from 'superagent';
import Calendar from './calendar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import '../App.css';
import logo from '../views/logo.png';
import FileTable from './file_table';

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

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <h3>Enter Time period</h3>
          <form onSubmit={this.handleSubmit}>
            <Calendar callbackFromParent={this.handleBeginCallback} />
            <Calendar callbackFromParent={this.handleEndCallback}/>
            <RaisedButton label="Get Results" type="submit" value="Submit" style={{marginLeft: '10'}}/>
          </form>
          <FileTable arrOfTimestamps={this.state.files} app={this.state.app} version={this.state.version}
            token={this.state.token}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default FileList;
