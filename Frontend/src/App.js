import React, {useState, useEffect} from "react";
import {connect} from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import "./App.css";

import Home from "./Components/Home/home.component";
import Login from "./Components/Login/login.component";
import Register from "./Components/Register/register.component";

import Http from "./utils/http.utils"; 

import {readUser} from './Redux/Reducers/user.reducer'
import {logUser} from './Redux/Actions/user.action';

const App = ({logUser,user}) => {

  useEffect(async()=>{
    const userResponse = await Http.get('/api/users/findUser');
    console.log(userResponse);
    if(userResponse.user){
      logUser(userResponse.user);
    }
  },[])



  return (
    <Router>
      <div>
        <header>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li className="right"><Link to="/login">Log in</Link></li>
            <li className="right"><Link to="/register">Register</Link></li>
          </ul>
        </header>
        <div className="content">
          <Switch>
            <Route exact path="/">{user!==null ? <Home />:<Redirect to="/login"/>}</Route>
            <Route path="/about"><h1>About</h1></Route>
            <Route path="/dashboard"><h1>DashBoard</h1></Route>
            <Route path="/register">{user!==null  ? <Redirect to="/"/> : (<Register />)}</Route>
            <Route path="/login">{user!==null  ? <Redirect to="/"/> : (<Login/>)}</Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

const mapStateToProps =state => {
  return ({
    user:readUser(state),
  })
  
}


export default connect(mapStateToProps,{logUser})(App);