import React, { Component } from 'react';
import request from 'superagent';
import createBrowserHistory  from 'history/createBrowserHistory';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import '../App.css';
import logo from '../views/logo.png';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class VersionButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      app: this.props.app,
      versions : [],
      token : this.props.token
    }
  }

  componentWillMount() {
    const url = 'http://localhost:8080/backup/versions?app=' + this.state.app + '&token=' + this.state.token;
    request.get(url)
        .end((err, res) => {
            if (err) {
              console.log('Error', err);
            } else{
              this.setState({ versions: res.body });
            }
        }
    );
  }


  render() {
    return(
        <div>
          <ul>
            {this.state.versions.map((version) => (
              <FlatButton label={version} labelStyle={{fontSize: '30'}} />
            ))}
          </ul>
        </div>
    );
  }
}

export default VersionButtons;
