import React, { Component } from "react";
import UserForm from "./components/UserForm";
import OrderStatus from "./components/OrderStatus";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact>
          <UserForm />
        </Route>
        <Route path="/orderStatus" exact>
          <OrderStatus />
        </Route>
      </Router>
    );
  }
}

export default App;
