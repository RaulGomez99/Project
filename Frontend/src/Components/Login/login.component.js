import React, { useState } from 'react';
import "./login.css"
import { Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Http from "../../utils/http.utils"; 



export default (props) => {
    const [text, setText] = useState("");
    const [password, setPassword] = useState("");

    const changeUserText = (e) => {
        setText(e.target.value);
    }

    const changePasswordText = (e) => {
        setPassword(e.target.value);
    }

    const login = () => {
        const data = {
            user:text,
            password: password
        }
        console.log("Prueba")
        Http.post(data,'/api/users/login','').then(resp=>{
            console.log(resp);
            if(resp.error) alert(resp.error);
            else props.setToken(resp);
        })
        
    }

    return(
        <div id="login">
            <Input size="large" prefix={<UserOutlined />} value={text} placeholder="User" onChange={changeUserText}/><br />
            <Input.Password size="large" value={password} placeholder="Password" onChange={changePasswordText}/><br />
            <Button type="primary" size="large" onClick={login}> Log in</Button>
        </div>
    )
}