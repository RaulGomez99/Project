import React from 'react';
import './header.css';
import { Avatar, Popover, Modal, Form, Input, Button, Upload } from 'antd';
import { readUser } from '../../Redux/Reducers/user.reducer'
import { connect } from 'react-redux';
import { PoweroffOutlined, EditOutlined } from "@ant-design/icons";
import Cookies from 'universal-cookie';
import { logOut } from '../../Redux/Actions/user.action'
import { useState } from 'react';
import ErrorManager from '../../errorManager';
import { useEffect } from 'react';
const env = require('../../env.json');

const icon = require('./favicon.ico');


const Header = ({user, logOut}) => {
    const [editProfile, setEditProfile] = useState(false)
    const [logo, setLogo] = useState(null);
    const [logoUploaded, setLogoUploaded] = useState(null);

    useEffect(()=>{
        const img ='default.png';
        if(user){
            if(user.logo){
                setLogo(user.logo);
                setLogoUploaded(user.logo);
            }else{
                setLogoUploaded(require('../../../img/avatarImg/'+img))
                setLogo(require('../../../img/avatarImg/'+img))
            }
        }else{
            setLogo(require('../../../img/avatarImg/'+img))
            setLogoUploaded(require('../../../img/avatarImg/'+img))
        }
    },[user])
    const removeCookie = () => {
        const cookies = new Cookies();
        cookies.remove('jwt');
        logOut();
    }

    const sendImageForm = async (values) => {
        console.log(values.upload);
        const isJpgOrPng = values.upload.file.type === 'image/png';
        if(values.upload.fileList.length>1) return ErrorManager('Tiene que ser un archivo no más');
        if(!isJpgOrPng) return ErrorManager('Tiene que ser una imágen png');
        const cookies = new Cookies();
        const token = cookies.get('jwt');
        const json = await fetch(`${env.URL}/api/users/editLogo/${user.id}`, {
            method: 'POST',
            body: JSON.stringify({img:logoUploaded}),
            headers: {
                "Content-Type": "application/json",
                authtoken: token
            }
        });
        const resp = await json.json();
        if(resp.msg) return ErrorManager(resp.msg);
        setLogo(logoUploaded);
        setEditProfile(false)
;    };

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }


    function onChange(info){
        console.log(info)
        if (info.file.status === 'uploading') {
            
            return;
        }
        if (info.file.status === 'error') {
            console.log("Arriba ESPAÑA")
            if(info.file.type === 'image/png') getBase64(info.file.originFileObj, (imageUrl) => changeLogoUpload(imageUrl));
        }
    }

    function changeLogoUpload(logo){
        console.log(logo);
        setLogoUploaded(logo)
    }
    
    const content = (
        <div>
            <div style={{cursor:"pointer"}}>
                <p className="logout" onClick={()=> setEditProfile(true)}>Editar <EditOutlined /></p>
            </div>
            <div style={{cursor:"pointer"}}>
                <p className="logout" onClick={removeCookie}>Log out <PoweroffOutlined /></p>
            </div>
        </div>
    )


    return (
        <header>
            <div style = {{float: "right"}}>  
                {!user ? "" : 
                    <div>
                        <Popover placement="bottom" content={content}>
                            <div style={{cursor:"pointer"}}>
                                <span style={{color:"#333"}}>{user.username.toUpperCase()}</span><Avatar src={logo} style={{margin : "8px"}}/>
                            </div>
                        </Popover>
                    </div>
                }
            </div>
            <div className="title">
                <a href="/">
                    <img src={icon} className="icono" alt=""/>
                    <h4 style={{display: "inline"}}>Easy Swiss Tournament</h4>
                </a>
            </div>
            {!user ? 
            <div style = {{float: "right"}}> 
                <div><a href="/login">Log in</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/register">Register</a></div>
            </div>
            :""}
            
            {!user ?<a href="/">Inicio</a>: 
            user.ispremiun ? 
            <div className="navChess">
                <div><a href="/tournaments">Mis torneos</a></div>
                <div><a href="/tournamentsparticipant">Torneos participo</a></div>
            </div> :  <div><a href="/tournamentsparticipant">Torneos participo</a></div>}
            <Modal className="modalNav" title="Editar perfil" visible={editProfile} onCancel={()=>setEditProfile(false)} onOk={()=>setEditProfile(false)}>
                <p style={{textAlign: "center"}}>Click en la foto para cambiarla</p>
                <div className="profileImage" style={{textAlign: "center"}}>
                    <Form onFinish={sendImageForm}>
                        <Form.Item name="upload">
                            <Upload listType="picture" onChange={onChange}>
                                <img src={logoUploaded} style={{width: "20vh", borderRadius: "100%"}}/>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">Enviar nueva imágen</Button>
                        </Form.Item>

                    </Form>
                </div>
            </Modal>
        </header>
    )
}

const mapStateToProps =state => {
    return ({
      user:readUser(state),
    })
    
  }

export default connect(mapStateToProps, { logOut })(Header);