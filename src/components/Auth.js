import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import Login from './Login';
import Register from './Register';

class Auth extends Component {
  state = { activeItem: 'login' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
      const { activeItem } = this.state;
      return (
        <>
            <Menu>
                <Menu.Menu position="right">
                    <Menu.Item
                        name="login"
                        active={activeItem === 'login'}
                        content="Login"
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name="register"
                        active={activeItem === 'register'}
                        content="Register"
                        onClick={this.handleItemClick}
                    />
                </Menu.Menu>
            </Menu>
            {activeItem === 'register' ? <Register /> : <Login setToken={this.props.setToken} />}
      </>
      );
  }
}

export default Auth;
