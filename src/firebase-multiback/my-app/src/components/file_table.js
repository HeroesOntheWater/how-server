import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import request from 'superagent';
import moment from 'moment';

const styles = {
  div: {
    display: 'block',
    width: '80%',
    margin: '0 auto',
    height: '65%',
    border: '2px solid #BEBEBE'
  },
  table: {
    height: '100%'
  }
}
export default class FileTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      all: false
    }
  }

  handleRowSelection = (selectedRows) => {
    if(selectedRows === 'all'){
      this.setState({all: true});
    } else if(selectedRows === "none") {
      this.setState({all: false});
      console.log("none");
    } else {
      console.log(selectedRows);
      this.setState({selectedRows: selectedRows});
    }
  }

  handleClick = () => {
    if(this.state.all === true){
      this.props.arrOfTimestamps.forEach((timestamp) => {
        var url = "http://localhost:8080/backup/download?token=" + this.props.token + "&app=" + this.props.app +
          "&version=" + this.props.version + "&timestamp=" + timestamp;
          console.log(url);
          request.get(url)
            .end((err, res) =>  {
              if(err) {
                console.log('Error', err);
              } else {
                window.open(url);
              }
          });
      })
    } else {
      this.state.selectedRows.forEach((index) => {
        var url = "http://localhost:8080/backup/download?token=" + this.props.token + "&app=" + this.props.app +
          "&version=" + this.props.version + "&timestamp=" + this.props.arrOfTimestamps[index];
          console.log(url);
          request.get(url)
            .end((err, res) =>  {
              if(err) {
                console.log('Error', err);
              } else {
                window.open(url);
              }
            });
        });
      }
  };

  render() {
    return (
      <div style={styles.div}>
        <Table height='100%' bodyStyle={{height:'91%'}} wrapperStyle={styles.table} height='500px' selectable={true} multiSelectable={true} onRowSelection={this.handleRowSelection}>
          <TableHeader enableSelectAll={true}>
            <TableRow>
              <TableHeaderColumn>Number</TableHeaderColumn>
              <TableHeaderColumn>Database</TableHeaderColumn>
              <TableHeaderColumn>Version</TableHeaderColumn>
              <TableHeaderColumn>Time</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
            {this.props.arrOfTimestamps.map((timestamp, index) => (
              <TableRow key={index} selected={this.state.selectedRows.indexOf(index) !== -1}>
                <TableRowColumn>{index}</TableRowColumn>
                <TableRowColumn>{this.props.app}</TableRowColumn>
                <TableRowColumn>{this.props.version}</TableRowColumn>
                <TableRowColumn>{moment(timestamp).format("DD MMM YYYY hh:mm a")}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
        <RaisedButton label="Download" onClick={this.handleClick} style={{marginTop: '15'}}/>
      </div>
    );
  }
}
