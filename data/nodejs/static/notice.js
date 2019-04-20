class Notice extends React.Component {
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
    /*
    this.setState({
      value:formatter.format(data.value)
    });*/
  }
  render(){
    //const notice = <div key="all">{this.state.value}</div>;
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