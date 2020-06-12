import React from 'react';
import "./register.css"
import { Input, Button, Card, Form } from 'antd';

import { connect } from 'react-redux';
import ErrorManager from '../../errorManager';

const env = require('../../env.json');

const Register =  () => {

    const validateUsername = async (_, username) => {
        const json = await fetch(`${env.URL}/api/users/checkUser/`+username);
        const resp = await json.json();
        if(resp.res) return Promise.reject('No puedes poner emails repetidos');
        return Promise.resolve();
    }

    const validateEmail = async (_, email) => {
        const json = await fetch(`${env.URL}/api/users/checkEmail/`+email);
        const resp = await json.json();
        if(resp.res) return Promise.reject('No puedes poner emails repetidos');
        return Promise.resolve();
    }


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
        if(resp.msg) return ErrorManager(resp.msg);
        else if(resp.success) window.location.replace(`${env.LOCAL_URL}/login`);
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
                <Form.Item className="doble" name={['user', 'username']} hasFeedback rules={[{ required: true, message:"UserName is required correct email"},{validator:validateUsername}]}>
                    <Input placeholder="UserName"/>
                </Form.Item >
                <Form.Item className="doble" name={['user', 'email']} hasFeedback rules={[{ required: true, type:"email", message:"Email is required correct email" },{validator: validateEmail}]}>
                    <Input placeholder="Email"/>
                </Form.Item >
                <Form.Item id="user_password" className="doble" name={['user', 'password']} hasFeedback rules={[{ required: true, message:"Password is required" }]}>
                    <Input.Password placeholder="Password"/>
                </Form.Item>
                <Form.Item className="doble" name={['user', 'repeatPassword']} hasFeedback rules={[
                    { required: true, message:"Repeat password is required and equal", validator:async (rule,value) =>{
                        const passwordRegister = document.getElementById("user_password").value;
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