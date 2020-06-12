import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import 'antd/dist/antd.css';

import Home from "./Components/Home/home.component";
import Login from "./Components/Login/login.component";
import Register from "./Components/Register/register.component";
import Header from './Components/Header/header.component';
import TournamentGestion from './Components/TournamentGestion/tournamentgestion.component';
import TournamentShow from "./Components/TournamentShow/tournamentshow.component";
import TournamentParticipantShow from './Components/TournamentParticipantShow/tournamentgestion.component';

import Cookies from 'universal-cookie';
import {readUser, readTournament} from './Redux/Reducers/user.reducer'
import {logUser} from './Redux/Actions/user.action';
import { Spin } from "antd";

const env = require('./env.json');

const backgroundImage = require('./img/otherImg/background.jpg');

const App = ({logUser,user, tournament}) => {
  const [update, setUpdate] = useState(true)

  useEffect(()=>{
    const findUserCookie = async()=>{
      const cookies = new Cookies();
      const token = cookies.get('jwt');
      const userResponse = await fetch(`${env.URL}/api/users/findUser`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          authtoken: token
        },withCredentials: true,
      });
      const json = await userResponse.json();
      if(json.user){
        logUser(json.user);
      }
      setUpdate(false);
    }
    findUserCookie();
  },[logUser])

  const returnCorrectUrlLogin = (Component) => (
    user === null ? <Component /> : <Redirect to='/'/>
  )

  const returnCorrectUrlContent = (Component) => (
    user === null ? <Redirect to='/login'/> : <Component />
  )

  const reutrnIsPremiun = (Component) => (
    user && user.ispremiun ?  <Component/> : <Redirect to="/"/>
  )

  const reutrnIsNotPremiun = (Component) => {
    if(user){
      return !user.ispremiun ?  <Component/> : <Redirect to="/tournaments"/>
    }
    return <Component/>
  }
  
  return (
    
    <div className="app">
      {!update ? (
        <div>
          <Header />
          <div className="content" style={{backgroundImage:`url(${backgroundImage})`}}>
            <Router>
                <Switch>
                  <Route path="/tournaments">{returnCorrectUrlContent(TournamentGestion)}</Route>
                  <Route exact path="/">{reutrnIsNotPremiun(Home)}</Route>
                  <Route path="/tournamentsparticipant">{returnCorrectUrlContent(TournamentParticipantShow)}</Route>
                  <Route path="/register">{returnCorrectUrlLogin(Register)}</Route>
                  <Route path="/login">{returnCorrectUrlLogin(Login)}</Route>
                  <Route path="/tournament/:id"><TournamentShow /></Route>
                </Switch>
            </Router>
          </div>
        </div>) : 
        (<div>
          <Header />
          <div className="content" style={{backgroundImage:`url(${backgroundImage})`}}>
            <Spin size="large" />
          </div>
        </div>)}
        {/* <div style = {{color: "trasparent", background:"trasparent"}}> */}
          <div id="imprimir" style={{overflow:"visible"}}> 

          </div>
        {/* </div> */}
    </div>
  );
};

const mapStateToProps =state => {
  return ({
    user:readUser(state),
    tournament: readTournament(state)
  })
  
}


export default connect(mapStateToProps,{logUser})(App);