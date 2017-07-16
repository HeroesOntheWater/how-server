import React, { Component } from 'react';

class BackupList extends Component {

  constructor(props){
    super(props);
    this.state = {
      apps : ['heroesonthewatertest2', 'test']
    };
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
