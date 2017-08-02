import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import '../App.css';
import logo from '../views/database.png';
import BackupDropdown from './backup_dropdown';
import VersionDropdown from './version_dropdown';
import Calendar from './calendar';
import FileTable from './file_table';
import Moment from 'moment';
import request from 'superagent';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const styles  = {
  imageStyle: {
    height: '40px',
    width: 'auto'
  },
  selection: {
    display: 'inline-block'
  },
  row: {
    paddingTop: '20px'
  },
  submit: {
    verticalAlign: 'bottom',
    width: '200px',
    height: '46px',
    margin: '20px',
  },
  label: {
    top: '10px',
    fontSize: '18px'
  },
  button: {
    backgroundColor: 'rgba(253, 236, 236, 0.64)'
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
  }

  handleSubmit = (event) => {
    var url = "http://localhost:8080/backup?token=" + this.state.token + "&app=" + this.state.app +
    "&version=" + this.state.version + "&fromDate=" + this.state.beginDate + "&toDate=" + this.state.endDate;
    request.get(url)
      .end((err, res) => {
          if (err) {
            alert('Error', err);
          } else {
            this.setState({files: res.body});
            console.log(url);
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
          <img src={logo} style={styles.imageStyle} alt="database icon"/>
        </div>
        <div style={styles.row}>
          <div style={{display:'inline-block'}}>
            <h3>Select a database</h3>
            <BackupDropdown token={this.state.token} callbackFromParent={this.handleBackupCallback}/>
          </div>
          <div style={{display:'inline-block'}}>
            <h3>Select a version</h3>
            {(this.state.app != null) &&
            <VersionDropdown token={this.state.token} app={this.state.app} callbackFromParent={this.handleVersionCallback}/>
            }
          </div>
          <div style={{display:'inline-block', verticalAlign:'top'}}>
            <h3>Select begin and end date/time</h3>
            <Calendar callbackFromParent={this.handleBeginDateCallback}/>
            <Calendar callbackFromParent={this.handleEndDateCallback} />
          </div>
          <RaisedButton label="Get Results" onClick={this.handleSubmit} style={styles.submit}
          buttonStyle={styles.button} labelStyle={styles.label}/>
        </div>
        <FileTable arrOfTimestamps={this.state.files} token={this.state.token} app={this.state.app}
        version={this.state.version} />
      </div>
    </MuiThemeProvider>
  );
  }
}

export default BackupList;
