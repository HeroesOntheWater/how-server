import React, { Component } from 'react';
import Login from './components/login';
import logo from './views/logo.png';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <p className="App-intro">
          Enter your registered email and password to look at the backups.
          </p>
          <Login />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
