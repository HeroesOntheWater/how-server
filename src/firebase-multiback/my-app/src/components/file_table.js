import React, {Component} from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table';
import moment from 'moment';

const styles = {
    div: {
        display: 'block',
        width: '80%',
        margin: '0 auto',
        height: 'auto',
        boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16) ,0 2px 10px 0 rgba(0,0,0,0.12)'
    },
    table: {
        height: '100%',
        maxHeight: '500px'
    },
    body: {
        height: '100%',
        display: 'inline'
    },
    header: {
        fontSize: '18px',
        color: 'black',
        fontWeight: '500'
    },
    row: {
        height: '70px'
    },
    item: {
        fontSize: '20px'
    }
}

const headers = ["Number", "Database", "Version", "Time"];

export default class FileTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            all: false
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return ((this.props.arrOfTimestamps !== nextProps.arrOfTimestamps) || (this.state.selectedRows !== nextState.selectedRows));
    }

    handleRowSelection = (selectedRows) => {
        this.props.callbackFromParent(selectedRows);
        if (selectedRows === 'all') {
            this.setState({all: true});
        } else if (selectedRows === "none") {
            this.setState({all: false, selectedRows: []});
            console.log("none");
        } else {
            this.setState({selectedRows: selectedRows});
        }
    }

    componentWillReceiveProps = (nextProps) => {
      this.setState({selectedRows: nextProps.selectedRows});
    }

    render() {
        return (
            <div style={styles.div}>
                <Table fixedHeader={true} bodyStyle={styles.body} wrapperStyle={styles.table} selectable={true} multiSelectable={true} onRowSelection={this.handleRowSelection}>
                    <TableHeader enableSelectAll={true}>
                        <TableRow>
                            {headers.map((header) => (
                              <TableHeaderColumn style={styles.header}>{header}</TableHeaderColumn>
                              ))
                            };
                        </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
                        {this.props.arrOfTimestamps.map((timestamp, index) => (
                            <TableRow style={styles.row} key={index} selected={this.state.selectedRows.indexOf(index) !== -1}>
                                <TableRowColumn style={styles.item}>{index}</TableRowColumn>
                                <TableRowColumn style={styles.item}>{this.props.app}</TableRowColumn>
                                <TableRowColumn style={styles.item}>{this.props.version}</TableRowColumn>
                                <TableRowColumn style={styles.item}>{moment(timestamp).format("DD MMM YYYY hh:mm a")}</TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}
