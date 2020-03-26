import React, { useState, useRef } from 'react';
import "./login.css"
import { Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Http from "../../utils/http.utils"; 

import {connect} from 'react-redux';
import {logUser} from '../../Redux/Actions/user.action';


const Login =  ({logUser}) => {
    const text = useRef("");
    const [password,setPassword] = useState("");

    const login = () => {
        const data = {
            username:text.current.state.value,
            password
        }
        Http.post(data,'/api/users/login').then(resp=>{
            console.log(resp.user)
            if(resp.error) alert(resp.error);
            else logUser(resp.user);
        }) 
    }

    return(
        <div id="login">
            <Input allowClear size="large" prefix={<UserOutlined />} placeholder="User" ref={text}/><br />
            <Input.Password size="large" placeholder="Password" 
                onChange={(e)=> {
                    setPassword(e.target.value);
                }}
                onKeyDown={(e) => {
                    if(e.keyCode===13){
                        login();
                    }
                }}
            /><br />
            <Button className="loginButton" type="primary"  onClick={login}> Log in</Button>
        </div>
    )
}

export default connect(null,{logUser})(Login);