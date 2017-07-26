import React, { Component } from 'react';
import Login from './components/login';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>
          <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <Login />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
