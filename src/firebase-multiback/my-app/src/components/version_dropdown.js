import React, { Component } from 'react';
import request from 'superagent';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DropdownList from 'react-widgets/lib/DropdownList';

class VersionDropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: this.props.token,
      app: this.props.app,
      versions: [],
      selectedVersion: ''
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
              this.setState({ selectedVersion: this.state.versions[0]});
              this.props.callbackFromParent(this.state.versions[0]);
            }
        }
    );
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.app === nextProps.app) {
      return;
    }
    const url = 'http://localhost:8080/backup/versions?app=' + nextProps.app + '&token=' + this.state.token;
    request.get(url)
        .end((err, res) => {
            if (err) {
              console.log('Error', err);
            } else {
              this.setState({ versions: res.body });
              this.setState({ selectedVersion: this.state.versions[0]});
              this.props.callbackFromParent(this.state.versions[0]);
            }
        }
    );
  }

  handleChange = (event) => {
    console.log(event);
    this.setState({selectedVersion: event});
    this.props.callbackFromParent(event);
  }

  render() {
    return(
      <div>
        {(!(this.state.versions && this.state.versions.length === 0)) &&
          <DropdownList data={this.state.versions} value={this.state.selectedVersion} onChange={this.handleChange}/>
        }
      </div>
    )
  }
}

export default VersionDropdown;
