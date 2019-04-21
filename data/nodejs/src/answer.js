import React from 'react';
import socket from './socket.js';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';

export default class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      comment: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleEnter(event) {
    if(event.key == 'Enter'){
      this.handleSubmit(event);
    }
  }
  handleSubmit(event) {
    var text = document.getElementById("answer").value;
    if( text != "" ){
      socket.emit('send_answer',{value:text});
      document.getElementById("answer").value = "";
    }
    event.preventDefault();
  }
  componentDidMount(){
    socket.on("send_answer_hit", (data) => {
      this.writeBoard(data);
    })
  }
  writeBoard(data){
    var comment = this.state.comment
    comment.unshift(data.value)
    if(comment.length > 30){
      comment.pop();
    }
    this.setState({
      comment:comment
    });
  }
  render() {
    const board = [];
    for(var index in this.state.comment){
      var answer = this.state.comment[index]['answer'];
      var notice = this.state.comment[index]['notice'];
      board.push(<TableRow key={index}><TableCell>{answer}</TableCell><TableCell>{notice}</TableCell></TableRow>);
    }
    return (
        <div className="col-xs-6">
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <div>
                <TextField name="answer" id="answer" label="answer" margin="normal" variant="outlined" onKeyPress={this.handleEnter}/>
              </div>
              <div>
                <Button variant="outlined" color="primary" type="Send" value="Send" onClick={this.handleSubmit} >
                Send
                </Button>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div>
                <Paper>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>きみの答え</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {board}
                    </TableBody>
                  </Table>
                </Paper>
              </div>
            </Grid>
          </Grid>
        </div>
    );
  }
}