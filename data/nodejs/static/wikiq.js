import React from 'react';
import ReactDOM from 'react-dom';

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
        <main className="main">
          {dom}
        </main>
      </div>
    );
  }
}

export default Wikiq;