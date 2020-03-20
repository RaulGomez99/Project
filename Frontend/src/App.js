import React, {useState, useEffect} from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Home from "./Components/Home/home.component";
import Login from "./Components/Login/login.component";
import Register from "./Components/Register/register.component";
import Http from "./utils/http.utils"; 

export default () => {
  const [user,setUser] = useState(null);

  const setToken = async (token) => {
    localStorage.setItem('token',token.token);
    setUser(await Http.get('/api/users/verifyToken',token));
  }
  useEffect(async()=>{
    const ourToken = localStorage.getItem('token');
    if(ourToken!==null){
      const userResponse = await Http.get('/api/users/verifyToken',ourToken);
      if(!userResponse.error){
        setUser(userResponse);
      }else{
        localStorage.clear();
      }
    }
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
              {user!==null  ? <Redirect to="/"/> : (<Register />)}
            </Route>
            <Route path="/login">
              {user!==null  ? <Redirect to="/"/> : (<Login setToken={setToken}/>)}
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};
