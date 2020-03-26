import React from 'react';
import "./home.css"

import { connect } from 'react-redux';

import { readUser } from '../../Redux/Reducers/user.reducer'
import { logOut } from '../../Redux/Actions/user.action';

import Http from '../../utils/http.utils';



const Home =  ({user,logOut}) => (
    <div className="home">
        {user.id}<br />
        {user.username}<br/>
        <button onClick={()=> {
            Http.get('/api/users/logout');
            logOut();
        }}>Log out</button>
    </div>
)

const mapStateToProps =state => {
    return ({
      user:readUser(state)
    })
    
  }

  export default connect(mapStateToProps,{logOut})(Home);