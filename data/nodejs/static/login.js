class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      login_type: 'random',
      expanded: 'random',
    };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeExpanded = this.handleChangeExpanded.bind(this);
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
    .then(function(res){
      console.log(res.body);
      if(res.status ==  200) {
        this.props.parentMethod();
      }
      return res.json;
    }.bind(this))
    .then(function(data){ console.log(data) });
  }

  handleChangeExpanded = panel => (event, expanded) => {
    console.log(expanded);
    this.setState({
      expanded: expanded ? panel : false,
      login_type: expanded ? panel : false,
    });
  };

  render() {
    return (
      <div className="center-block notice_box">
        <form id="login_form" onSubmit={this.handleSubmit}>
        <div>
          <TextField name="nickname" id="nickname" label="nickname" margin="normal" variant="outlined" onKeyPress={this.handleEnter}/>
        </div>
        <div>
          <TextField name="password" id="password" label="password" margin="normal" variant="outlined" onKeyPress={this.handleEnter}/>
        </div>
        <div>
          <ExpansionPanel value="create" expanded={this.state.expanded === 'create'} onChange={this.handleChangeExpanded('create')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <FormControlLabel value="create" control={<Radio checked={this.state.login_type === 'create'} name="login_type"/>} label="Create Mode" />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel value="join" expanded={this.state.expanded === 'join'} onChange={this.handleChangeExpanded('join')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <FormControlLabel value="join" control={<Radio checked={this.state.login_type === 'join'} name="login_type"/>} label="Join Mode" />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                <div>
                <TextField name="room" id="room" label="room_id" margin="normal" variant="outlined" onKeyPress={this.handleEnter}/>
                </div>
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel value="random" expanded={this.state.expanded === 'random'} onChange={this.handleChangeExpanded('random')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <FormControlLabel value="random" control={<Radio checked={this.state.login_type === 'random'} name="login_type"/>} label="Random Mode" />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <Button variant="outlined" color="primary" type="submit" value="join">
            Join
          </Button>
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

export default Login;