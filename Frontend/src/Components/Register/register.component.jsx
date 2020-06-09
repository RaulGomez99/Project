import React from 'react';
import "./register.css"
import { Input, Button, Card, Form } from 'antd';

import { connect } from 'react-redux';
import { logUser } from '../../Redux/Actions/user.action';

const env = require('../../env.json');

const Register =  () => {
    const register = async (values) => {
        const data ={
            username:values.user.username,
            password:values.user.password,
            name:values.user.name,
            lastName:values.user.lastName,
            email:values.user.email,
        }
        const json = await fetch(`${env.URL}/api/users/register`,{
            method:'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const resp = await json.json();
        console.log(resp.user)
        if(resp.error) alert(resp.error);
        else logUser(resp.user);
    }

    return(
        <Card className="register" bordered={false} style={{ width: 300 }} title="Register">
            <Form className="registerGrid" onFinish={register}>
                <Form.Item name={['user', 'name']} hasFeedback rules={[{ required: true, message:"First name is required" }]}>
                    <Input placeholder="First name"/>
                </Form.Item>
                <Form.Item name={['user', 'lastName']} hasFeedback rules={[{ required: true, message:"Last name is required"}]}>
                    <Input placeholder="Last name"/>
                </Form.Item>
                <Form.Item className="doble" name={['user', 'username']} hasFeedback rules={[{ required: true, message:"UserName is required correct email"}]}>
                    <Input placeholder="UserName"/>
                </Form.Item >
                <Form.Item className="doble" name={['user', 'email']} hasFeedback rules={[{ required: true, type:"email", message:"Email is required correct email" }]}>
                    <Input placeholder="Email"/>
                </Form.Item >
                <Form.Item id="user_password" className="doble" name={['user', 'password']} hasFeedback rules={[{ required: true, message:"Password is required" }]}>
                    <Input.Password placeholder="Password"/>
                </Form.Item>
                <Form.Item className="doble" name={['user', 'repeatPassword']} hasFeedback rules={[
                    { required: true, message:"Repeat password is required and equal", validator:async (rule,value) =>{
                        console.log(value);
                        const passwordRegister = document.getElementById("user_password").value;
                        console.log(passwordRegister)
                        if(value!==passwordRegister){
                            throw new Error("Not repeat password");
                        }
                        
                } }]}>
                    <Input.Password placeholder="Cofirm Password"/>
                </Form.Item>
                <p className="loginMessage doble">Si ya tienes una cuenta puedes ir a <a href="login">Log in</a></p>
                <Form.Item className="doble">
                    <Button className="loginButton" type="primary" htmlType="submit">Register</Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default connect(null)(Register);