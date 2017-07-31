import React, {Component} from 'react';
import Datetime from 'react-datetime';
import '../views/calendar.css';

const style = {
  div: {
    width: '200px',
    height: 'auto',
    display: 'inline-block',
    margin: '20px'
  },
  dropDown: {
    width: '200px',
    height: 'auto',
    display: 'inline-block'
  }
}

class Calendar extends Component {

  handleChange = (event) => {
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
