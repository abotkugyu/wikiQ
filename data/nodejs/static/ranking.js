
class Ranking extends React.Component {
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
      board.push(<tr key={index}><td>{this.state.comment[index]['rank']}</td><td>{this.state.comment[index]['name']}</td></tr>);
    }
    return (
        <div className="col-xs-6">
          <table className="mdl-data-table mdl-data-table--selectable mdl-shadow--2dp">
            <thead>
              <tr>
                <th>ランキング</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {board}
            </tbody>
          </table>
        </div>
    );
  }
}