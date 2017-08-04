import React, {Component} from 'react';
import Datetime from 'react-datetime';
import '../views/calendar.css';

const style = {
  div: {
    width: '200px',
    height: '48px',
    display: 'inline-block',
    margin: '10px 20px 20px 20px',
    verticalAlign: 'top',
    fontFamily: 'sans-serif'
 }
}

const today = new Date();

var valid = function(current) {
  return current.isBefore(today);
}

class Calendar extends Component {

  handleChange = (event) => {
    this.props.callbackFromParent(event._d.valueOf());
  }

  render() {
    return (
      <div style={style.div}>
        <Datetime defaultValue={today} isValidDate={valid} onChange={this.handleChange} inputProps={{readOnly:true}}/>
      </div>
    );
  }
}

export default Calendar;
