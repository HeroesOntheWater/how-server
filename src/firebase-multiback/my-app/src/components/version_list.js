import React, { Component } from 'react';
import request from 'superagent';
import createBrowserHistory  from 'history/createBrowserHistory';

const history = createBrowserHistory ({
  forceRefresh: true
});

class BackupList extends Component {

  constructor(props){
    super(props);
    this.state = {
      app: this.props.location.state.app,
      versions : [],
      token : this.props.location.state.token
    };
  }

  componentWillMount() {
    const url = 'http://localhost:8080/backup/versions?app=' + this.state.app + '&token=' + this.state.token;
    request.get(url)
        .end((err, res) => {
            if (err) {
              console.log('Error', err);
            } else if(res.body != null){
              this.setState({ versions: res.body });
            } else {
              history.push('/backups/other');
            }
        }
    );
  }

  render() {
    return(
    <div>
      <ul>
        {this.state.versions.map((version) => (
          <li key={version}>{version}</li>
        ))}
      </ul>
    </div>
  );
  }
}

export default BackupList;
