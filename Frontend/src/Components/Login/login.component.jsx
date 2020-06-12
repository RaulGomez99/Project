import React from 'react';
import "./login.css"
import { Input, Button, Card, Form } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import { logUser } from '../../Redux/Actions/user.action';
import ErrorManager from '../../errorManager';

const env = require('../../env.json');

const Login =  ({ logUser }) => {

    const login = async (values) => {
        const data = {
            username:values.user.username,
            password:values.user.password
        }
        const json = await fetch(`${env.URL}/api/users/login`,{
            method:'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const resp = await json.json();
        if(resp.msg) return ErrorManager(resp.msg);
        else {
            const cookies = new Cookies();
            cookies.set('jwt', resp.token, { path: '/' });
            logUser(resp.user);
        }
    }

    return(
        <Card className="login" bordered={false} title="Log in">
            <Form  onFinish={login}>
                <Form.Item name={['user', 'username']} hasFeedback rules={[{ required: true, message:"UserName is required"}]}>
                    <Input prefix={<UserOutlined/>} allowClear placeholder="User" />
                </Form.Item>
                <Form.Item name={['user', 'password']} hasFeedback rules={[{ required: true, message:"Password is required"}]}>
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <p className="loginMessage doble">Si no tienes cuenta te puedes <a href="register">registrar</a> aquí</p>
                <Form.Item>
                    <Button htmlType="submit" className="loginButton" type="primary"> Log in</Button><br /><br />
                </Form.Item>
            </Form>
        </Card>
    )
}

export default connect(null,{logUser})(Login);