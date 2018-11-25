import React, { Component } from "react";
import { Form, Message, Button, Grid, Input } from "semantic-ui-react";
class Register extends Component {
  state = {
    error: "",
    message: "",
    email: "",
    password: "",
    confirmPassword: ""
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
            confirmPassword: ""
          });
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

  render() {
    return (
      <Grid columns="equal">
        <Grid.Column />
        <Grid.Column />
        <Grid.Column>
          {this.state.error && (
            <Message error header="Error" content={this.state.error} />
          )}
          {this.state.message && (
            <Message
              header={this.state.message}
              content={"You can now log in."}
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
                autoComplete="new-password"
              />
            </Form.Field>
            <Button type="submit">Register</Button>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
