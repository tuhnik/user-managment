import React, { Component } from "react";
import {
  Form,
  Message,
  Button,
  Modal,
  Input,
  Header,
  Icon
} from "semantic-ui-react";

class AddUser extends Component {
  state = {
    error: "",
    message: "",
    email: "",
    password: "",
    confirmPassword: "",
    modalOpen: false
  };

  componentDidMount = () => {
    this.setState({ modalOpen: true });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: "Passwords don't match!" });
      return;
    }
    fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          this.setState({ error: data.error, message: "" });
        } else {
          this.setState({
            message: data.message,
            error: "",
            email: "",
            password: "",
            confirmPassword: "",
            modalOpen: false
          });
          this.props.addUserDone();
          this.props.getUsers();
        }
      });
  };

  handleEmailInput = e => {
    this.setState({ email: e.target.value });
  };

  handlePasswordInput = e => {
    this.setState({ password: e.target.value });
  };

  handleConfirmPasswordInput = e => {
    this.setState({ confirmPassword: e.target.value });
  };

  handleClose = () => {
    this.setState({ modalOpen: false });
    this.props.addUserDone();
  };

  render() {
    return (
      <Modal size="mini" open={this.state.modalOpen} onClose={this.handleClose}>
        <Header icon="archive" content="Register a new user" />
        <Modal.Content>
          {this.state.error && (
            <Message error header="Error" content={this.state.error} />
          )}
          {this.state.message && (
            <Message
              header={this.state.message}
              content="Check your e-mail to verify account!"
            />
          )}
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>E-mail</label>
              <Input
                placeholder="E-mail"
                onChange={this.handleEmailInput}
                value={this.state.email}
                autoComplete="email"
              />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <Input
                type="password"
                placeholder="Password"
                onChange={this.handlePasswordInput}
                value={this.state.password}
                name="new-password"
                autoComplete="new-password"
              />
            </Form.Field>
            <Form.Field>
              <label>Confirm password</label>
              <Input
                type="password"
                placeholder="Confirm password"
                onChange={this.handleConfirmPasswordInput}
                value={this.state.confirmPassword}
                name="new-password"
                autoComplete="new-password"
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleClose} color="red">
            <Icon name="remove" /> Cancel
          </Button>
          <Button onClick={this.handleSubmit} color="green">
            <Icon name="checkmark" /> Register
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default AddUser;
