import React,{useState} from 'react';
import './header.css';
import { MobileView, BrowserView } from 'react-device-detect';
import { Menu, Button, Avatar } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { readUser } from '../../Redux/Reducers/user.reducer'
import { connect } from 'react-redux';



const Header = ({user}) => {
    const [collapsed, toggleCollapsed] = useState(false);
    console.log(user);
    const img = user ? user.logo : 'default.png';
    console.log(img)
    const logo = require('../../../img/avatarImg/'+img);

    return (
        <header>
            <BrowserView>
                <ul>
                    <li><a href="/">Inicio</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    {!user ? <li className="right"><a href="/login">Log in</a></li> : ""}
                    {!user ? <li className="right"><a href="/register">Register</a></li> : <Avatar src={logo} className="right"/>}
                </ul>
            </BrowserView>
            <MobileView>
                <div className="mobile" style={{backgroundColor:"black"}}>
                    <Button onClick={()=>{toggleCollapsed(!collapsed)}} style={{ marginBottom: 16 }}>
                        {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    </Button>
                    {collapsed ?
                    <Menu theme="dark" mode="inline">
                        <Menu.Item key="1">
                            <span>Inicio</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <span>About</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <span>Dashboard</span>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <a href="/register">Register</a>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <a href="/login">Log in</a>
                        </Menu.Item>
                    </Menu>:null}
                </div>
                    
            </MobileView>
        </header>
    )
}

const mapStateToProps =state => {
    return ({
      user:readUser(state),
    })
    
  }

export default connect(mapStateToProps)(Header);