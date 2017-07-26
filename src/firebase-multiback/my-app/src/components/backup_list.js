import React, { Component } from 'react';
import request from 'superagent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import '../App.css';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import VersionButtons from './version_buttons';
import '../App.css';
import logo from '../views/logo.png';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10
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
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
          <Tabs onChange={this.handleChange} value={this.state.slideIndex}>
            {this.state.apps.map((app,index) => (
              <Tab label={app} value={index} labelStyle={{fontSize: '30'}} />
            ))}
          </Tabs>
          <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}>
            {(!(this.state.apps && this.state.apps.length === 0)) &&
              this.state.apps.map((app) => (
                <div style={styles.slide}>
                  <VersionButtons app={app} token={this.state.token} />
                </div>
              ))
            }
          </SwipeableViews>
      </div>
    </MuiThemeProvider>
  );
  }
}

export default BackupList;
