import Login from './login';
import Contents from './contents';
import socket from './socket.js';

import React from 'react';
import ReactDOM from 'react-dom'


export default class Wikiq extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      nickname: "",
    };
    this.login = this.login.bind(this);
  }
  login(nickname) {
    console.log(nickname);
    this.setState({
      value: 1,
      nickname: nickname,
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
        <main className="main">
          {dom}
        </main>
      </div>
    );
  }
}

ReactDOM.render(
  <Wikiq />,
  document.getElementById('wikiq')
)