import React, {useState, useEffect} from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import Home from "./Components/Home/home.component";
import Login from "./Components/Login/login.component";
import Register from "./Components/Register/register.component";

export default () => {
  const [user,setUser] = useState(null);

  const setUserCookie = (userReceived) => {
    Cookies.set(userReceived.id)
    setUser(userReceived.id);
  }
  useEffect(()=>{
    let userCookie = Cookies.get('user');
    if(!userCookie) Cookies.set('user',-1);
    setUser(Cookies.get('user'));
  },[])

  return (
    <Router>
      <div>
        <header>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="right">
              <Link to="/login">Log in</Link>
            </li>
            <li className="right">
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </header>
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/about">
              <h1>About</h1>
            </Route>
            <Route path="/dashboard">
              <h1>DashBoard</h1>
            </Route>
            <Route path="/register">
              {user>=0  ? <Redirect to="/"/> : (<Register />)}
            </Route>
            <Route path="/login">
              {user>=0  ? <Redirect to="/"/> : (<Login logUser={setUserCookie}/>)}
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};
