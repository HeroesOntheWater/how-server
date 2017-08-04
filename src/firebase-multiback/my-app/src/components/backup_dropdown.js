import React, {Component} from 'react';
import request from 'superagent';
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';

const styles = {
    div: {
        width: '225px',
        height: 'auto',
        display: 'inline-block',
        margin: '10px 20px 20px 20px'
    },
    dropDown: {
        fontSize: '16px'
    }
}

class BackupDropdown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: this.props.token,
            apps: [],
            selectedApp: ''
        };
    }

    componentWillMount() {
        const url = 'http://localhost:8080/backup/apps?token=' + this.state.token;
        request.get(url).end((err, res) => {
            if (err) {
                console.log('Error', err);
            } else {
                this.setState({apps: res.body, selectedApp: res.body[0]});
                this.props.callbackFromParent(res.body[0])
            }
        });
    }

    componentWillReceiveProps = (nextState) => {
        if (nextState.app === null) {
            this.setState({selectedApp: this.state.apps[0]})
            this.props.callbackFromParent(this.state.apps[0])
        }
    };

    handleChange = (event) => {
        this.setState({selectedApp: event});
        this.props.callbackFromParent(event);
    }

    render() {
        return (
            <div style={styles.div}>
                {(!(this.state.apps && this.state.apps.length === 0))
                  && <DropdownList style={styles.dropDown} data={this.state.apps} value={this.state.selectedApp} onChange={this.handleChange}/>}
            </div>
        )
    }
}

export default BackupDropdown;
