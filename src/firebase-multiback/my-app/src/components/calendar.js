import React, {Component} from 'react';
import Datetime from 'react-datetime';
import '../views/calendar.css';

const style = {
  div: {
    width: '200px',
    height: 'auto',
    display: 'inline-block',
    margin: '20px',
    verticalAlign: 'top',
    fontFamily: 'sans-serif'
 },
 calendar: {
   backgroundColor: 'green'
 }
}

class Calendar extends Component {

  handleChange = (event) => {
    this.props.callbackFromParent(event._d.valueOf());
  }

  render() {
    return (
      <div style={style.div}>
        <Datetime style={style.calendar} defaultValue={new Date()} onChange={this.handleChange }/>
      </div>
    );
  }
}

export default Calendar;
