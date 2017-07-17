import React, { Component } from 'react';
import request from 'superagent';

class BackupList extends Component {

  constructor(props){
    super(props);
    this.state = {
      apps : []
    };
  }

  componentWillMount() {
    const url = 'http://localhost:8080/backup/apps?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MDAyNDE5MjF9.qEPsG9m07luztQiLOvL5Ym1lIZY1tsbmSbXjhcMP5Hk';
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
    <div>
      <ul>
        {this.state.apps.map((app) => (
          <li key={app}>{app}</li>
        ))}
      </ul>
    </div>
  );
  }
}

export default BackupList;
