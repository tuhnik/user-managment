import React, { Component } from "react";
import { Form, Button, Grid, Message, Input } from "semantic-ui-react";

class Login extends Component {
  state = {
    email: "",
    password: "",
    error: ""
  };
  handleSubmit = e => {
    e.preventDefault();
    fetch("http://localhost:5000/api/login", {
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
        if (!data.error) {
          this.props.setToken(data.email, data.token);
        } else {
          this.setState({ error: data.error });
        }
      });
  };

  handleEmailInput = e => {
    this.setState({ email: e.target.value });
  };
  handlePasswordInput = e => {
    this.setState({ password: e.target.value });
  };

  render() {
    let { error } = this.state;
    return (
      <Grid columns="equal">
        <Grid.Column />
        <Grid.Column />
        <Grid.Column>
          {error && <Message error header="Error" content={error} />}
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>E-mail</label>
              <Input
                placeholder="E-mail"
                onChange={this.handleEmailInput}
                value={this.state.email}
              />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <Input
                type="Password"
                placeholder="Password"
                onChange={this.handlePasswordInput}
                value={this.state.password}
              />
            </Form.Field>
            <Button type="submit">Login</Button>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
