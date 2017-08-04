import React, {Component} from 'react';
import Datetime from 'react-datetime';
import Moment from 'moment';
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

const today = Moment(new Date());
const valid = function(current) {
    return current.isBefore(today);
}

class Calendar extends Component {

    constructor(props) {
      super(props);
      this.state = {
        date: today
      }
    }

    handleChange = (event) => {
        this.setState({date: event});
        this.props.callbackFromParent(event._d.valueOf());
    }

    componentWillReceiveProps = (nextProps) => {
      this.setState({date: nextProps.date});
    }

    render() {
        return (
            <div style={style.div}>
                <Datetime defaultValue={today} value={this.state.date} isValidDate={valid} onChange={this.handleChange} inputProps={{
                    readOnly: true
                }}/>
            </div>
        );
    }
}

export default Calendar;
