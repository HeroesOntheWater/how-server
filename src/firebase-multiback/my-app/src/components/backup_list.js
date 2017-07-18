import React, { Component } from 'react';
import request from 'superagent';
import process from 'dotenv'

class BackupList extends Component {

  constructor(props){
    super(props);
    this.state = {
      apps : [],
      token : props.location.token
    };
  }

  componentWillMount() {
    console.log(this.state.token);
    const url = "google.com";
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

  render() {
    return(
      <h1>Test</h1>
    /*<div>
      <ul>
        {this.state.apps.map((app) => (
          <li key={app}>{app}</li>
        ))}
      </ul>
    </div>*/
  );
  }
}

export default BackupList;
