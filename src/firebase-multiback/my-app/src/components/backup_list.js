import React, { Component } from 'react';
import request from 'superagent';
import createBrowserHistory  from 'history/createBrowserHistory';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import '../App.css';
import logo from '../views/logo.png';
import FlatButton from 'material-ui/FlatButton';

const history = createBrowserHistory( {
  forceRefresh:true
});

const style = {
  height: "100px",
  width: "51%",
  clear: "left"
}

class BackupList extends Component {

  constructor(props){
    super(props);
    this.state = {
      apps : [],
      token : this.props.location.state.token
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const url = 'http://localhost:8080/backup/apps?token=' + this.state.token;
    request.get(url)
        .end((err, res) => {
            if (err) {
              console.log('Error', err);
            } else {
              this.setState({ apps: res.body });
            }
        }
    );
  }

  handleClick(app) {
    history.push('/backups/version', {app: app, token:this.state.token});
  }

  render() {
    return(
      <MuiThemeProvider>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>
          {this.state.apps.map((app) => (
            <FlatButton label={app} labelStyle={{fontSize: '30'}} onClick={() => this.handleClick(app)}
            key={app} style={style} />
          ))}
      </div>
    </MuiThemeProvider>
    );
  }
}

export default BackupList;
