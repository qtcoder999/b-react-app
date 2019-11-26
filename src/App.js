import React, { Component } from "react";
import "./App.css";
// API
import BaseAPI from "./api/BaseAPI";
// Components
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import UserForm from "./components/UserForm";

class App extends Component {
  state = {
    username: "",
    password: "",

    isModalOpen: false
  };

  onSubmit = async values => {
    const { username, password } = values;

    try {
      const token = await BaseAPI.onLogin(username, password);
      const user = await BaseAPI.onGetUserInfo(token.accessToken);
      console.log(user);
    } catch (error) {
      const { data } = error.response;
      if (data.appCode === 0) {
        console.log("Catch Error {LOGIN}");
        this.onToggleModal("login");
      }
      console.log("Catch Error {USER_PROFILE}", error);
    }
  };

  onToggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  render() {
    return (
      <UserForm />
      // <div className="container">
      //   <header className="App-header">
      //     <h1 className="App-title">BlackForest</h1>
      //   </header>
      //   <FontAwesomeIcon icon={faCoffee} />
      //   <LoginForm
      //     username={this.state.username}
      //     password={this.state.password}
      //     onSubmit={this.onSubmit}
      //   />
      //   <Modal
      //     isOpen={this.state.isModalOpen}
      //     onToggle={this.onToggleModal}
      //   />
      // </div>
    );
  }
}

export default App;
