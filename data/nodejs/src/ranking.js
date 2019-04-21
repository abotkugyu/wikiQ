import React from 'react';
import socket from './socket.js';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      comment: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleSubmit(event) {
    socket.emit('send_to_other',{value:this.state.value})
    event.preventDefault();
  }
  componentDidMount(){
    socket.on("write", (data) => {
      this.writeBoard(data);
    })
  }
  writeBoard(data){
    var comment = this.state.comment;
    var is_write = true;
    if(is_write){
      this.setState({
        comment:data.value
      });
      if(document.getElementById("toggle-notification").checked){
        var text = data.value.text.replace(/[0-9a-zA-Z]{8}?/,"");
        var n = new Notification(text+"\n"+data.value.id);
      }
    }
  }
  render() {
    const board = [];
    for(var index in this.state.comment){
      board.push(<TableRow key={index}><TableCell>{this.state.comment[index]['rank']}</TableCell><TableCell>{this.state.comment[index]['name']}</TableCell></TableRow>);
    }
    return (
        <div>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ランキング</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {board}
              </TableBody>
            </Table>
          </Paper>
        </div>
    );
  }
}