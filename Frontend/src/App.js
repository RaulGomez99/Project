import React, { useEffect } from "react";
import {connect} from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import 'antd/dist/antd.css';

import Home from "./Components/Home/home.component";
import Login from "./Components/Login/login.component";
import Register from "./Components/Register/register.component";
import Header from './Components/Header/header.component';

import Http from "./utils/http.utils"; 

import {readUser} from './Redux/Reducers/user.reducer'
import {logUser} from './Redux/Actions/user.action';

const App = ({logUser,user}) => {

  useEffect(()=>{
    const findUserCookie = async()=>{
      const userResponse = await Http.get('/api/users/findUser');
      console.log(userResponse);
      if(userResponse.user){
        logUser(userResponse.user);
      }
    }
    findUserCookie();
  },[])

  const returnCorrectUrlLogin = (Component) => (
    user === null ? <Component /> : <Redirect to='/'/>
  )

  const returnCorrectUrlContent = (Component) => (
    user === null ? <Redirect to='/login'/> : <Component />
  )
  
  return (
    <div className="app">
      <Header />
      <div className="content">
        <Router>
            <Switch>
              <Route exact path="/">{returnCorrectUrlContent(Home)}</Route>
              <Route path="/about"><h1>About</h1></Route>
              <Route path="/dashboard"><h1>DashBoard</h1></Route>
              <Route path="/register">{returnCorrectUrlLogin(Register)}</Route>
              <Route path="/login">{returnCorrectUrlLogin(Login)}</Route>
            </Switch>
        </Router>
      </div>
    </div>
  );
};

const mapStateToProps =state => {
  return ({
    user:readUser(state),
  })
  
}


export default connect(mapStateToProps,{logUser})(App);