import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Moment from 'moment';
import request from 'superagent';
import injectTapEventPlugin from 'react-tap-event-plugin';
import BackupDropdown from './backup_dropdown';
import VersionDropdown from './version_dropdown';
import Calendar from './calendar';
import FileTable from './file_table';
import RaisedButton from 'material-ui/RaisedButton';
import '../App.css';
import logo from '../views/database.png';

injectTapEventPlugin();

const styles = {
    imageStyle: {
        height: '40px',
        width: 'auto'
    },
    selection: {
        display: 'inline-block'
    },
    row: {
        paddingTop: '5px'
    },
    submit: {
        verticalAlign: 'bottom',
        width: '200px',
        height: '39px',
        margin: '10px 20px 30px 20px'
    },
    label: {
        top: '6px',
        fontSize: '18px'
    },
    submitButon: {
        backgroundColor: 'rgba(253, 236, 236, 0.64)'
    },
    header: {
        fontWeight: '500',
        fontSize: '18px'
    },
    bottomButton: {
      margin: '15'
    }
}

const today = Moment(new Date());
const todayTimestamp = Moment.unix(today) / 1000;

class BackupList extends Component {
  
    constructor(props) {
        super(props);
        this.state = {
            token: this.props.location.state.token,
            app: null,
            version: null,
            beginDate: todayTimestamp,
            endDate: todayTimestamp,
            arrOfTimestamps: [],
            selectedRows: [],
            all: null
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

    handleFileTableCallback = (selectedRows) => {
        if (selectedRows === 'all') {
            this.setState({all: true});
        } else if (selectedRows === "none") {
            this.setState({all: false, selectedRows: []});
        } else {
            this.setState({selectedRows: selectedRows});
        }
    }

    handleClear = () => {
        this.setState({arrOfTimestamps: [], selectedRows: [], app: null, beginDate: todayTimestamp, endDate: todayTimestamp});
    }

    handleSubmit = (event) => {
        this.setState({selectedRows: []});
        var url = "http://localhost:8080/backup?token=" + this.state.token + "&app=" + this.state.app + "&version=" + this.state.version + "&fromDate=" + this.state.beginDate + "&toDate=" + this.state.endDate;
        request.get(url).end((err, res) => {
            if (err) {
                alert('Error', err);
            } else if (res.body.length === 0) {
                this.setState({arrOfTimestamps: res.body});
                alert("No files for given time period.");
            } else {
                this.setState({arrOfTimestamps: res.body});
            }
        });
        event.preventDefault();
    }

    handleClick = () => {
        if (this.state.all) {
            this.state.arrOfTimestamps.forEach((timestamp) => {
              var url = "http://localhost:8080/backup/download?token=" + this.state.token + "&app=" + this.state.app +
                "&version=" + this.state.version + "&timestamp=" + timestamp;
                request.get(url).end((err, res) => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        window.open(url);
                    }
                });
            })
        } else {
            this.state.selectedRows.forEach((index) => {
              var url = "http://localhost:8080/backup/download?token=" + this.state.token + "&app=" + this.state.app +
              "&version=" + this.state.version + "&timestamp=" + this.state.arrOfTimestamps[index];
              request.get(url).end((err, res) => {
                    if (err) {
                        console.log('Error', err);
                    } else {
                        window.open(url);
                    }
                });
            });
        }
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <div className="App-header">
                        <img src={logo} style={styles.imageStyle} alt="database icon"/>
                    </div>
                    <div style={styles.row}>
                        <div style={{
                            display: 'inline-block'
                        }}>
                            <h3 style={styles.header}>Select a database</h3>
                            <BackupDropdown token={this.state.token} app={this.state.app} callbackFromParent={this.handleBackupCallback}/>
                        </div>
                        <div style={{
                            display: 'inline-block'
                        }}>
                            <h3 style={styles.header}>Select a version</h3>
                            {(this.state.app != null) && <VersionDropdown token={this.state.token} app={this.state.app} callbackFromParent={this.handleVersionCallback}/>}
                        </div>
                        <div style={{
                            display: 'inline-block',
                            verticalAlign: 'top'
                        }}>
                            <h3 style={styles.header}>Select begin and end date/time</h3>
                            <Calendar date={this.state.beginDate} callbackFromParent={this.handleBeginDateCallback}/>
                            <Calendar date={this.state.endDate} callbackFromParent={this.handleEndDateCallback}/>
                        </div>
                        <RaisedButton label="Get Results" onClick={this.handleSubmit} style={styles.submit} buttonStyle={styles.submitButton} labelStyle={styles.label}/>
                    </div>
                    <FileTable arrOfTimestamps={this.state.arrOfTimestamps} selectedRows={this.state.selectedRows} token={this.state.token} app={this.state.app} version={this.state.version} callbackFromParent={this.handleFileTableCallback}/>
                    <RaisedButton label="Download" onClick={this.handleClick} style={styles.bottomButton}/>
                    <RaisedButton label="Clear" onClick={this.handleClear} style={styles.bottomButton}/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default BackupList;
