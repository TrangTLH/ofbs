import { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import './App.css';
import home from "./screens/home";
import login from "./screens/login";
import register from "./screens/register";
import forgetPassword from "./screens/forget-password";
import searchResult from "./screens/searchResult";

class App extends Component {
  render() {
    return (
        <Router>
          <div className="App">
            <Route path="/" exact component={home} />
            <Route path="/login" component={login} />
            <Route path="/register" component={register} />
            <Route path="/forget-password" component={forgetPassword} />
            <Route path="/search-result" component={searchResult} />
          </div>
        </Router>
    );
  }
}

export default App;
