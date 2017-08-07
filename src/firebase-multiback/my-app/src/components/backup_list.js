import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Moment from 'moment';
import injectTapEventPlugin from 'react-tap-event-plugin';
import BackupDropdown from './backup_dropdown';
import VersionDropdown from './version_dropdown';
import Calendar from './calendar';
import FileTable from './file_table';
import RaisedButton from 'material-ui/RaisedButton';
import '../App.css';
import ApiHandler from '../utils/api_handler';

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
        ApiHandler.makeRequest(this.state.token,this.state.app,this.state.version,this.state.beginDate,this.state.endDate)
          .then((data)=>this.setState({arrOfTimestamps: data}));
        event.preventDefault();
    }

    handleClick = () => {
        if (this.state.all) {
            this.state.arrOfTimestamps.forEach((timestamp) => {
              ApiHandler.downloadAll(this.state.token, this.state.app, this.state.version, timestamp);
            });
        } else {
            this.state.selectedRows.forEach((index) => {
              ApiHandler.downloadFile(this.state.token, this.state.app, this.state.version, this.state.arrOfTimestamps[index]);
            });
        }
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <div className="App-header">
                        <h2>Firebase(FB) Database Backup Management System</h2>
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
