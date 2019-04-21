import React from 'react';
import parse, { Wiki } from './parse.js';
import Paper from '@material-ui/core/paper';
import Typography from '@material-ui/core/Typography';
import socket from './socket.js';


export default class Notice extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: '',
    };
  }
  componentDidMount(){
    socket.on("notice", (data) => {
      this.notice(data);
    })
  }
  notice(data){
    var value = this.state.value;
    var formatter = new Wiki.Formatter();
    document.getElementById('notice_board').innerHTML = formatter.format(data.value);

  }
  render(){
    return(
      <div className="">
        <Paper>
          <Typography id="notice_board" component="p">
          </Typography>
        </Paper>
      </div>
    );
  }
}