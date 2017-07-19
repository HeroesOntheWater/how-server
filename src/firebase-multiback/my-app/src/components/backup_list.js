import React, { Component } from 'react';
import request from 'superagent';
import {Route, Link} from 'react-router-dom';
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
              console.log(res.body);
            }
        }
    );
  }

  handleClick(event) {
    history.push('/backups/version', {token:this.state.token});
  }

  render() {
    return(
    <div>
      <ul>
        {this.state.apps.map((app) => (
          <li onClick={this.handleClick} key={app}>{app}</li>
        ))}
      </ul>
    </div>
  );
  }
}

export default BackupList;
