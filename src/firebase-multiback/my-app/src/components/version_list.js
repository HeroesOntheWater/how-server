import React, { Component } from 'react';
import request from 'superagent';
import createBrowserHistory  from 'history/createBrowserHistory';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import '../App.css';
import logo from '../views/database.png';
import FlatButton from 'material-ui/FlatButton';

const history = createBrowserHistory ({
  forceRefresh: true
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
      app: this.props.location.state.app,
      versions : [],
      token : this.props.location.state.token
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const url = 'http://localhost:8080/backup/versions?app=' + this.state.app + '&token=' + this.state.token;
    request.get(url)
        .end((err, res) => {
            if (err) {
              console.log('Error', err);
            } else if(res.body[0] != 'default'){
              this.setState({ versions: res.body });
            } else {
              history.push('/backups/version/files', {app:this.state.app, version:'default', token:this.state.token});
            }
        }
    );
  }

  handleClick(app, version) {
    history.push('/backups/version/files', {app: app, version: version, token:this.state.token});
  }

  render() {
    return(
    <MuiThemeProvider>
      <div className="App">
        <div className="App-header">
          <img src={logo} style={style.imageStyle} alt="database icon"/>
        </div>
        <div>
          <ul>
            {this.state.versions.map((version) => (
              <FlatButton label={version} labelStyle={{fontSize: '30'}} onClick={() => this.handleClick(this.state.app, version)}
              style={style} />
            ))}
          </ul>
        </div>
      </div>
    </MuiThemeProvider>
    );
  }
}

export default BackupList;
