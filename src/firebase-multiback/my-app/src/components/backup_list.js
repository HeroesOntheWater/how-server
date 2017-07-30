import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import '../App.css';
import '../App.css';
import logo from '../views/database.png';
import BackupDropdown from './backup_dropdown';
import VersionDropdown from './version_dropdown';
import Calendar from './calendar';
import Moment from 'moment';
import request from 'superagent';

import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const styles  = {
  imageStyle: {
    height: '40px',
    width: 'auto'
  }
}

var todayTimestamp = Moment.unix(new Date())._i/1000;

class BackupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.location.state.token,
      app: null,
      version: null,
      beginDate: todayTimestamp,
      endDate: todayTimestamp,
      files: []
    };
  }

  handleVersionCallback = (version) => {
    this.setState({version: version});
  }

  handleBackupCallback = (app) => {
    this.setState({app: app});
  }

  handleBeginDateCallback = (date) => {
    this.setState({beginDate: date});
  }

  handleEndDateCallback = (date) => {
    this.setState({endDate: date});
    console.log(this.state.beginDate);
  }

  handleSubmit = (event) => {
    console.log(this.state.app);
    console.log(this.state.version);
    console.log(this.state.beginDate);
    console.log(this.state.endDate);
    event.preventDefault();
  }

  render() {
    return (
      <MuiThemeProvider>
      <div className="App">
        <div className="App-header">
          <img src={logo} style={styles.imageStyle} alt="database icon"/>
        </div>
        <BackupDropdown token={this.state.token} callbackFromParent={this.handleBackupCallback}/>
        {(this.state.app != null) &&
          <VersionDropdown token={this.state.token} app={this.state.app} callbackFromParent={this.handleVersionCallback}/>
        }
        <Calendar callbackFromParent={this.handleBeginDateCallback}/>
        <Calendar callbackFromParent={this.handleEndDateCallback} />
        <RaisedButton label="Get Results" onClick={this.handleSubmit}/>
      </div>
    </MuiThemeProvider>
  );
  }
}

export default BackupList;
