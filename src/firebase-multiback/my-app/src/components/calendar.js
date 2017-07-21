import React, {Component} from 'react';
import Datetime from 'react-datetime';

class Calendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      endTimestamp: ''
    }
  }

  handleChange = (event) => {
    this.setState({endTimestamp: event._d.valueOf()});
    this.props.callbackFromParent(event._d.valueOf());
  }

  /*constructor(props) {
    super(props);
    this.state = {
      date: "1990-06-05",
      format: "YYYY-MM-DD",
      inputFormat: "DD/MM/YYYY",
      mode: "date"
    };
  }

  handleChange = (newDate) => {
    console.log("newDate", newDate);
    return this.setState({date: newDate});
  }*/

  render() {
    return (
      <div>
        <Datetime defaultValue={new Date()} onChange={this.handleChange }/>
      </div>
    );
  }
}

export default Calendar;
