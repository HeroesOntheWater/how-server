import React, { Component } from 'react';
import request from 'superagent';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class BackupDropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: this.props.token,
      app: this.props.app,
      versions: [],
      value: 0
    }
  }

  componentWillMount() {
    const url = 'http://localhost:8080/backup/versions?app=' + this.state.app + '&token=' + this.state.token;
    request.get(url)
        .end((err, res) => {
            if (err) {
              console.log('Error', err);
            } else {
              this.setState({ versions: res.body });
              this.props.callbackFromParent(this.state.versions[0]);
            }
        }
    );
  }

  componentWillReceiveProps(nextProps) {
    const url = 'http://localhost:8080/backup/versions?app=' + nextProps.app + '&token=' + this.state.token;
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

  handleChange = (event, index, value) => {
    this.props.callbackFromParent(this.state.versions[value]);
    this.setState({value});
  }

  render() {
    return(
        <DropDownMenu value={this.state.value} onChange={this.handleChange} style={{width:200}}>
        {(!(this.state.versions && this.state.versions.length === 0)) &&
          this.state.versions.map((version, index) => (
            <MenuItem value={index} primaryText={version} />
          ))
        }
        </DropDownMenu>
    )
  }
}

export default BackupDropdown;
