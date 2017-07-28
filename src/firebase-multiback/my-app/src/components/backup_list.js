import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import '../App.css';
import '../App.css';
import logo from '../views/database.png';
import BackupDropdown from './backup_dropdown';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


const styles  = {
  imageStyle: {
    height: '40px',
    width: 'auto'
  }
}

class BackupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.location.state.token,
    };
  }

  render() {
    return (
      <MuiThemeProvider>
      <div className="App">
        <div className="App-header">
          <img src={logo} style={styles.imageStyle} alt="database icon"/>
        </div>
        <BackupDropdown token={this.state.token} />
      </div>
    </MuiThemeProvider>
  );
  }
}

export default BackupList;
