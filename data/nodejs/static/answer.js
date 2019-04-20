class Answer extends React.Component {
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
      board.push(<tr key={index}><td>{answer}</td><td>{notice}</td></tr>);
    }
    return (
        <div className="col-xs-6">
          <div>
            <div className="input-group">
                <input className="form-control" type="text" id="answer" placeholder="...answer" onKeyPress={this.handleEnter}/>
                <span className="input-group-btn">
                  <button onClick={this.handleSubmit} className="btn btn-default">Sned</button>
                </span>
            </div>
          </div>
          <div>
            <br/>
            <table className="mdl-data-table mdl-data-table--selectable mdl-shadow--2dp">
              <thead>
                <tr>
                  <th>きみの答え</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {board}
              </tbody>
            </table>
          </div>
        </div>
    );
  }
}