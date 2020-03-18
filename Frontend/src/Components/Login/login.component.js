import React, { useState } from 'react';
import "./login.css"
import { Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';



export default () => {
    const [text, setText] = useState("");
    const [password, setPassword] = useState("");

    const changeUserText = (e) => {
        setText(e.target.value);
    }

    const changePasswordText = (e) => {
        setPassword(e.target.value);
    }

    const login = () => {
        console.log(text,password)
    }

    return(
        <div id="login">
            <Input size="large" prefix={<UserOutlined />} value={text} placeholder="User" onChange={changeUserText}/><br />
            <Input.Password size="large" value={password} placeholder="Password" onChange={changePasswordText}/><br />
            <Button type="primary" size="large" onClick={login} > Log in</Button>
        </div>
    )
}