import React, { Component } from 'react';
import request from 'superagent';

class BackupList extends Component {

  constructor(props){
    super(props);
    this.state = {
      versions : [],
      token : this.props.location.state.token
    };
  }

  componentWillMount() {
    const url = 'http://localhost:8080/backup/versions?app=database2&token=' + this.state.token;
    request.get(url)
        .end((err, res) => {
            if (err) {
              console.log('Error', err);
            } else {
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
          <li key={version}>{version}</li>
        ))}
      </ul>
    </div>
  );
  }
}

export default BackupList;
