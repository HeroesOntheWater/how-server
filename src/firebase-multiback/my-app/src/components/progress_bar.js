import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: 0,
    };
  }

  render() {
    return (
      <div>
        <CircularProgress size={80} thickness={5} />
      </div>
    );
  }
}

export default ProgressBar;
