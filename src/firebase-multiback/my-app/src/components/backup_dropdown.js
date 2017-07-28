import React, { Component } from 'react';
import request from 'superagent';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class BackupDropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: this.props.token,
      apps: [],
      value: 0
    };
  }

  componentWillMount() {
    const url = 'http://localhost:8080/backup/apps?token=' + this.state.token;
    request.get(url)
        .end((err, res) => {
            if (err) {
              console.log('Error', err);
            } else {
              this.setState({ apps: res.body });
              this.props.callbackFromParent(this.state.apps[0])
            }
        }
    );
  }

  handleChange = (event, index, value) => {
    this.setState({value});
    this.props.callbackFromParent(this.state.apps[value]);
  }

  render() {
    return(
      <DropDownMenu value={this.state.value} onChange={this.handleChange} style={{width:200}}>
        {(!(this.state.apps && this.state.apps.length === 0)) &&
          this.state.apps.map((app, index) => (
            <MenuItem value={index} primaryText={app} />
          ))
        }
      </DropDownMenu>
    )
  }
}

export default BackupDropdown;
