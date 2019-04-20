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
      <div>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            centered
          >
            <Tab label="WikiQ">
              <div>
                <Notice />
              </div>
              <Ranking />
              <Answer />
            </Tab>
            <Tab label="Info">Item Two</Tab>
          </Tabs>
        <div className="mdl-tabs__tab-bar">
          <a href="#starks-panel" className="mdl-tabs__tab is-active">wikiQ</a>
        </div>
        <div className="mdl-tabs__panel is-active" id="starks-panel">
          <div>
            <Notice />
          </div>
          <Ranking />
          <Answer />
        </div>
      </div>
    )
  }
}
export default Content;