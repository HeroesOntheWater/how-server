import React, {Component} from 'react';
import Datetime from 'react-datetime';

class Calendar extends Component {

  handleChange = (event) => {
    this.props.callbackFromParent(event._d.valueOf());
  }

  render() {
    return (
      <div>
        <Datetime defaultValue={new Date()} onChange={this.handleChange }/>
      </div>
    );
  }
}

export default Calendar;
