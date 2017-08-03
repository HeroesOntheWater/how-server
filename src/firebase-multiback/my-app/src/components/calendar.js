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

class Calendar extends Component {

  handleChange = (event) => {
    console.log(event._d.valueOf());
    this.props.callbackFromParent(event._d.valueOf());
  }

  render() {
    return (
      <div style={style.div}>
        <Datetime defaultValue={new Date()} onChange={this.handleChange }/>
      </div>
    );
  }
}

export default Calendar;
