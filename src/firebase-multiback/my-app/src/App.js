import React, { Component } from 'react';
import Login from './components/login';
import logo from './views/database.png';
import {Card, CardTitle} from 'material-ui/Card';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const style  = {
  imageStyle: {
    height: '40px',
    width: 'auto'
  },
  cardStyle: {
    height: '500',
    width: '55%',
    position: 'relative',
    left: 'auto',
    right: 'auto',
    display: 'inline-block',
    marginTop: '5%',
    boxShadow: '20px 20px 5px #a6a6a6',
    border: '2px #888888 solid'
  },
  titleStyle: {
    fontSize: '30px',
    margin: '10px',
    fontWeight: '600'
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="App-header">
            <img src={logo} style={style.imageStyle} alt="database icon"/>
          </div>
          <Card style={style.cardStyle}>
            <CardTitle title="Enter your registered email and password to look at the backups" titleStyle={style.titleStyle}/>
            <Login />
          </Card>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
