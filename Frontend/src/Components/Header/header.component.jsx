import React,{useState} from 'react';
import './header.css';
import { MobileView, BrowserView } from 'react-device-detect';
import { Menu, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';



const Header = () => {
    const [collapsed, toggleCollapsed] = useState(false);

    return (
        <header>
            <BrowserView>
                <ul>
                    <li><a href="/">Inicio</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li className="right"><a href="/login">Log in</a></li>
                    <li className="right"><a href="/register">Register</a></li>
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

export default Header;