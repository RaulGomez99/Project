import React, { useState, useRef } from 'react';
import "./login.css"
import { Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Http from "../../utils/http.utils"; 

import {connect} from 'react-redux';
import {setItem} from '../../Redux/Actions/user.action';


// let password = "";
// const password="a";
const Login =  ({setItem}) => {
    const text = useRef("");
    const [password,setPassword] = useState("");

    const login = () => {
        const data = {
            user:text.current.state.value,
            password
        }
        console.log(data,text,password)
        Http.post(data,'/api/users/login','').then(resp=>{
            console.log(resp)
            if(resp.error) alert(resp.error);
            else{
                localStorage.setItem('token',resp.token);
                setItem({user:resp.user,token:resp.token});
            }
        })
        
    }

    return(
        <div id="login">
            <Input size="large" prefix={<UserOutlined />} placeholder="User" ref={text}/><br />
            <Input.Password size="large" placeholder="Password" onChange={(e)=> {
                console.log(e.target.value,password);
                setPassword(e.target.value);
            }}/><br />
            <Button type="primary" size="large" onClick={login}> Log in</Button>
        </div>
    )
}

export default connect(null,{setItem})(Login);