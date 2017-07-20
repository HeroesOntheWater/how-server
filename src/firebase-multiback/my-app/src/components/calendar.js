import React, {Component} from 'react';
import Datetime from 'react-datetime';

class Calendar extends Component {
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
        <Datetime />
      </div>
    );
  }
}

export default Calendar;
