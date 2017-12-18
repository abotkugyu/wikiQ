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
      <div>
        <div id="notice_board">
        </div>
      </div>
    );
  }
}
class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }
  render() {
    return (
        <div>
          <div>wikiQとは
            <ul>
                <li>wikipediaのページの概要から、記事のタイトルかを答えるクイズアプリです。</li>
            </ul>
          </div>
          <div>使い方
            <ul>
                <li>開始したら概要が流れますので、テキストボックスに答えを入力して送信してください</li>
            </ul>
          </div>
          <div>注意点
            <ul>
                <li>難しすぎる</li>
            </ul>
          </div>
        </div>
    )
  } 
}
class Contents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }
          //<a href="#lannisters-panel" className="mdl-tabs__tab">info</a>
  render() {
    return (
      <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
        <div className="mdl-tabs__tab-bar">
          <a href="#starks-panel" className="mdl-tabs__tab is-active">wikiQ</a>
        </div>
        <div className="mdl-tabs__panel is-active" id="starks-panel">
          <div className="notice_box demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--8-col">
            <Notice />
          </div>
          <Ranking />
          <Answer />
        </div>
      </div>
    )
  }
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleEnter(event) {
    if(event.key == 'Enter'){
      if( event.currentTarget.id == 'nickname' ){
        document.getElementById("password").focus();
      }else{
        this.handleSubmit(event);

      }
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    var data = new FormData(document.getElementById('login_form'));
    fetch("/login",
    {
        method: "POST",
        body: data
    })
    .then(function(res){ /*return res.json();*/ })
    .then(function(data){ /*alert( JSON.stringify( data ) )*/ });
    this.props.parentMethod();
  }
  render() {
    return (
      <div className="center-block notice_box">
        <form id="login_form">
        <div className="row form-group">
          <div className="col-md-4 col-xs-3"></div>
          <div className="col-md-4 col-xs-6">
            <div className="input-group">
              <span className="input-group-addon">nickname</span>
              <input type="text" name="nickname" id="nickname" onKeyPress={this.handleEnter} className="form-control" placeholder="nickname"/>
            </div>
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-4 col-xs-3"></div>
          <div className="col-md-4 col-xs-6">
            <div className="input-group">
              <span className="input-group-addon">password</span>
              <input type="password" name="password" id="password" onKeyPress={this.handleEnter} className="form-control" placeholder="password"/>
            </div>
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-4 col-xs-3"></div>
          <div className="col-md-4 col-xs-6">
            <div>
              <button type="button" onClick={this.handleSubmit} className="btn btn-default">login</button>
            </div>
          </div>
        </div>
      </form>
      </div>
    );
  }
}
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }
  render() {
    return (
      <div>
        <LoginForm parentMethod={this.props.parentMethod}/>
      </div>
    );
  }
}

class Wikiq extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
    this.login = this.login.bind(this);
  }
  login() {
    var value = this.state.value;
    this.setState({
      value:1
    });
  }
  render() {
    var dom = "";
    if(this.state.value == 0){
      dom = <Login parentMethod={this.login} />;
    } else {
      dom = <Contents />;
    }
    return (
      <div>
        <main className="mdl-layout__content main">
          {dom}
        </main>
      </div>
    );
  }
}
ReactDOM.render(
  <Wikiq />,
  document.getElementById('wikiq')
);
/*
ReactDOM.render(
  <Login />,
  document.getElementById('login')
);
ReactDOM.render(
  <Ranking />,
  document.getElementById('ranking')
);
ReactDOM.render(
  <Answer />,
  document.getElementById('ansewr')
);
ReactDOM.render(
  <Notice />,
  document.getElementById('notice')
);*/