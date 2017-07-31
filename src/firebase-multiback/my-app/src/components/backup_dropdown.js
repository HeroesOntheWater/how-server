import React, { Component } from 'react';
import request from 'superagent';
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/lib/less/react-widgets.less';

class BackupDropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: this.props.token,
      apps: [],
      selectedApp: ''
    };
  }

  componentWillMount() {
    const url = 'http://localhost:8080/backup/apps?token=' + this.state.token;
    request.get(url)
        .end((err, res) => {
            if (err) {
              console.log('Error', err);
            } else {
              this.setState({apps: res.body});
              this.setState({selectedApp: this.state.apps[0]})
              this.props.callbackFromParent(this.state.apps[0])
            }
        }
    );
  }

  handleChange = (event) => {
    this.setState({selectedApp: event});
    this.props.callbackFromParent(event);
  }

  render() {
    return(
      <div>
        {(!(this.state.apps && this.state.apps.length === 0)) &&
          <DropdownList data={this.state.apps} value={this.state.selectedApp} onChange={this.handleChange}/>
        }
      </div>
    )
  }
}

export default BackupDropdown;
