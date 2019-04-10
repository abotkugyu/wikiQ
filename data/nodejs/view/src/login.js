import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
    if(event.key === 'Enter'){
      if( event.currentTarget.id === 'nickname' ){
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
        <div>
        <TextField name="nickname" id="nickname" label="nickname" margin="normal" variant="outlined" onKeyPress={this.handleEnter}/>
        </div>
        <div>
        <TextField name="password" id="password" label="password" margin="normal" variant="outlined" onKeyPress={this.handleEnter}/>
        </div>
        <Button variant="outlined" color="primary" onClick={this.handleSubmit}>
          Login
        </Button>
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

export default Login;