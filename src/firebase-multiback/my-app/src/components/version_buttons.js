import React, { Component } from 'react';
import request from 'superagent';
import createBrowserHistory  from 'history/createBrowserHistory';
import RaisedButton from 'material-ui/RaisedButton';

const history = createBrowserHistory ({
  forceRefresh: true
});

const style = {
  margin: '20'
}

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

  handleClick = (version) => {
    history.push('/backups/version/files', {app:this.state.app, version:version, token:this.state.token});
  };

  render() {
    return(
        <div>
          <ul>
            {this.state.versions.map((version) => (
              <RaisedButton style={style} label={version} labelStyle={{fontSize: '30'}}
              onClick={()=>this.handleClick(version)} />
            ))}
          </ul>
        </div>
    );
  }
}

export default VersionButtons;
