import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Notice from './notice';
import Ranking from './ranking';
import Answer from './answer';
import Info from './info';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default class Contents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <div>
         <AppBar position="static">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            variant="fullWidth"
            centered
          >
            <Tab label="WikiQ"/>
            <Tab label="Info" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>
          <div className="">
            <div>
              <Notice />
            </div>
            <div>
              <Answer />
            </div>
            <div>
              <Ranking />
            </div>
          </div>
        </TabContainer>}
        {value === 1 && <TabContainer>
          <Info />
        </TabContainer>}                
      </div>
    )
  }
}