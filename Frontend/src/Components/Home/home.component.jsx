import React from 'react';
import "./home.css"

import {connect} from 'react-redux';

import {readUser, readToken} from '../../Redux/Reducers/user.reducer'
import {logOut} from '../../Redux/Actions/user.action';



const Home =  ({user,token,logOut}) => { 

    return(
        <div>
            {user.id}<br />
            {user.username}<br/>
            {token}<br/>
            <button onClick={()=> {logOut()}}>Log out</button>

        </div>
    )
}

const mapStateToProps =state => {
    return ({
      user:readUser(state),
      token:readToken(state)
    })
    
  }

  export default connect(mapStateToProps,{logOut})(Home);