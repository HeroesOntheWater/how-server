import React, { Component } from 'react';
import request from 'superagent';
import {Link} from 'react-router-dom';
import createBrowserHistory  from 'history/createBrowserHistory';

const history = createBrowserHistory( {
  forceRefresh:true
});

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
    <div>
      <ul>
        {this.state.apps.map((app) => (
          <li onClick={() => this.handleClick(app)} key={app}>{app}</li>
        ))}
      </ul>
    </div>
  );
  }
}

export default BackupList;
