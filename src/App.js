import React, { Component } from "react";
import { Container, Header, Icon } from "semantic-ui-react";
import Auth from "./components/Auth";
import Users from "./components/Users";
import AddUser from "./components/AddUser";

class App extends Component {
  state = {
    logged: false,
    email: "",
    loading: true,
    adding: false,
    data: null,
    total: 0,
    serverError: false,
    activePage: 1,
    itemsOnPage: 5
  };

  componentDidMount = () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (email && token) {
      this.checkLocalStorageToken(email, token);
    } else {
      this.setState({ loading: false });
    }
  };

  getUsers = (from, to) => {
    const { activePage, itemsOnPage } = this.state;
    let qs = makeQueryString(activePage, itemsOnPage);
    fetch("http://localhost:5000/api/users" + qs, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": "Bearer " + this.state.token
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({ data: data.data, total: data.total, error: "" });
        }
      });
  };

  deleteUser = id => {
    fetch("http://localhost:5000/api/delete/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": "Bearer " + this.state.token
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({ error: "" });
          this.fixActivePageAfterDelete();
        }
      });
  };

  checkLocalStorageToken = (email, token) => {
    fetch("http://localhost:5000/api/validate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": "Bearer " + token
      },
      body: JSON.stringify({ email })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          this.setState({
            token: "",
            email: "",
            logged: false,
            loading: false
          });
          return;
        }
        this.setState({ token, email, logged: true });
        this.setState({ loading: false });
      })
      .catch(err => {
        this.serverError();
      });
  };

  setToken = (email, token) => {
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
    this.setState({
      token,
      logged: true,
      email
    });
  };
  serverError = () => {
    this.setState({ serverError: "Unable to connect server", loading: false });
  };
  logout = () => {
    this.setState({ logged: false, token: "", email: "" });
    localStorage.removeItem("email");
    localStorage.removeItem("token");
  };

  addUser = () => this.setState({ adding: true });

  addUserDone = () => this.setState({ adding: false });

  fixActivePageAfterDelete = () => {
    let { activePage, total, itemsOnPage } = this.state;
    if (activePage * itemsOnPage - itemsOnPage >= total - 1) {
      activePage -= 1;
    }
    this.changeActivePage(activePage);
  };
  changeActivePage = activePage => {
    this.setState({ activePage }, () => {
      this.getUsers();
    });
  };

  render() {
    const { email, data, adding, logged, loading, total } = this.state;
    return (
      <Container>
        <Header as="h2" icon textAlign="center" style={{ paddingTop: "2rem" }}>
          <Icon name="user" />
          User Managment
          <Header.Subheader>
            {email ||
              this.state.serverError ||
              (!loading && "Tool for adding and deleting users")}
          </Header.Subheader>
        </Header>
        {adding && (
          <AddUser addUserDone={this.addUserDone} getUsers={this.getUsers} />
        )}
        {!logged && !loading && <Auth setToken={this.setToken.bind(this)} />}
        {logged && (
          <Users
            data={data}
            changeActivePage={this.changeActivePage}
            activePage={this.state.activePage}
            getUsers={this.getUsers}
            addUser={this.addUser}
            deleteUser={this.deleteUser}
            logOut={this.logout}
            total={total}
          />
        )}
      </Container>
    );
  }
}

function makeQueryString(active, onpage) {
  let from = active * onpage - onpage;
  let to = active * onpage;
  return "?from=" + (from || 0) + "&to=" + (to || 5);
}

export default App;
