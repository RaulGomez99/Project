import React from 'react';
import './header.css';
import { Avatar } from 'antd';
import { readUser } from '../../Redux/Reducers/user.reducer'
import { connect } from 'react-redux';

const Header = ({user}) => {
    const img = user ? user.logo : 'default.png';
    const logo = require('../../../img/avatarImg/'+img);

    return (
        <header>
            <ul>
                <li><a href="/">Inicio</a></li>
                {user?<li><a href="/about">About</a></li>:""}
                {user?<li><a href="/dashboard">Dashboard</a></li>:""}
                {!user ? <li className="right"><a href="/login">Log in</a></li> : ""}
                {!user ? <li className="right"><a href="/register">Register</a></li> : <Avatar src={logo} className="right"/>}
            </ul>           
        </header>
    )
}

const mapStateToProps =state => {
    return ({
      user:readUser(state),
    })
    
  }

export default connect(mapStateToProps)(Header);