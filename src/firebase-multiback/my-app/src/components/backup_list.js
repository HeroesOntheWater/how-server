import React, { Component } from 'react';
import request from 'superagent';
import createBrowserHistory  from 'history/createBrowserHistory';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import '../App.css';
import logo from '../views/logo.png';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import Slider from 'material-ui/Slider';
import VersionButtons from './version_buttons';

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const history = createBrowserHistory( {
  forceRefresh:true
});

/*const style = {
  margin: 20,
  minWidth: 200
}*/

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
  },
};

class BackupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      apps: [],
      token: this.props.location.state.token
    };
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

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Tabs onChange={this.handleChange} value={this.state.slideIndex}>
            {this.state.apps.map((app,index) => (
              <Tab label={app} value={index} labelStyle={{fontSize: '30'}} />
            ))}
          </Tabs>
          <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}>
            {(!(this.state.apps && this.state.apps.length == 0)) &&
              this.state.apps.map((app) => (
                <div>
                  <VersionButtons app={app} token={this.state.token} />
                </div>
              ))
            }
          </SwipeableViews>
      </div>
    </MuiThemeProvider>
  );
}

  /*constructor(props){
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
          </div>
          {this.state.apps.map((app) => (
            <RaisedButton label={app} onClick={() => this.handleClick(app)}
            key={app} style={style} labelStyle={{fontSize: '30'}} />
          ))}
      </div>
    </MuiThemeProvider>
    );
  }*/
}

export default BackupList;
