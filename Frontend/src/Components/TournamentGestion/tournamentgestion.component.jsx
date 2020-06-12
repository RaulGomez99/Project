import React, {useState, useEffect} from "react";
import { Table, Tag, Button, Card, Modal, Input, Form, Upload, Avatar, Checkbox } from "antd";
import { DeleteOutlined, EditOutlined, UserAddOutlined, EyeOutlined, FilePdfOutlined, UploadOutlined } from "@ant-design/icons";

import { connect } from 'react-redux';
import { readUser, readTournament } from '../../Redux/Reducers/user.reducer'
import { addTournament, removeTournament, selectTournament } from '../../Redux/Actions/user.action'
import TournamentEditor from '../TournamentEditor/tournamenteditor.component'

import Cookies from 'universal-cookie';
import pdfCreate from '../../lib/pdfCreate';

import ErrorManager from '../../errorManager';

import './tournamentGestion.css';

const env = require('../../env.json');
const defaultImg = require('./default.png');

const TournamentGestion = ({ user, addTournament, removeTournament, selectTournament, tournament }) => {
    const [showTournamentForm, setShowTournamentForm] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [values, setValues] = useState(false);

    useEffect(()=>{
        if(!user.ispremiun) selectTournament(user.tournaments[0].id);
      })

    const columns = [
        {title: "ID", dataIndex: "id", key: "id"},
        {title: "Nombre Torneo", dataIndex: "name", key: "name"},
        {title: "Descripcion", dataIndex: "description", key: "description"},
        {title: "Logo", dataIndex:'idphoto', key:'idphoto', render : state => {
            if(state) return <Avatar src={state}/>
            return <Avatar src={defaultImg}/>
        }},
        {title: "Estado", key: "state", dataIndex: "state", render: state => (
            <span>
                {state>0 ? <Tag color="green">Ronda {state}</Tag> 
                    :  state<0 ? <Tag color="red">Finalizado</Tag> 
                    : <Tag color="grey">En prescripción</Tag>}
            </span>
        )},
        {
          title: "Action",
          key: "action",
          render: (text, record) => (
            <span>
              {record.state != -1 ? <EditOutlined style={{ marginRight: 16, cursor:'pointer' }} onClick={() => {tournamentEdit(record.id);}}/>:""}
              {record.state <=  0 ? <DeleteOutlined style={{ marginRight: 16, color: "red", cursor:'pointer' }}  onClick={() => {deleteTournament(record.id);}}/>:""}
              {record.state !=  0 ? <a href={`${env.LOCAL_URL}/tournament/${record.id}`}><EyeOutlined style={{marginRight: 16, color: "blue", cursor:'pointer' }}/></a>:""}
              {record.state !=  0 ? <FilePdfOutlined style={{color: "gray", cursor:'pointer' }} onClick={()=>pdfCreate.generateTournamentPDF(record)}/>:""}
            </span>
          )
        }
    ]

    const deleteTournament = async (id) => {
        const cookies = new Cookies();
        const token = cookies.get('jwt');
    
        const json = await fetch(`${env.URL}/api/tournaments/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                authtoken: token
            }
        });
        const resp = await json.json();
        if(resp.msg) return ErrorManager(resp.msg);
        removeTournament(id)
    }

    const tournamentEdit = async id => {
        selectTournament(id);
    }

    function getBase64(img, tournament, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result, tournament));
        reader.readAsDataURL(img);
    }

    async function sendTournament(img, tournament){
        const data =  {tournament,img}
        const cookies = new Cookies();
        const token = cookies.get('jwt');
        const json = await fetch(`${env.URL}/api/tournaments`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                authtoken: token
            }
        });
        const resp = await json.json();
        if(resp.msg) return ErrorManager(resp.msg);
        addTournament(resp)
        setShowTournamentForm(false);
    }

    const createTournamentConfirm = (values)=>{
        setValues(values);
        const cookies = new Cookies();
        if(cookies.get('step1')){
            createTournament();
        }else{
            setConfirm(true);
        }
    }

    const sendConfirmining = () => {
        const cookies = new Cookies();
        if(document.querySelector('.ant-checkbox-input').checked) cookies.set('step1', true);
        setConfirm(false);
        createTournament();
    }


    const createTournament = async () => {
        const isJpgOrPng = values.upload && values.upload.file.type === 'image/png';
        if(values.upload && values.upload.fileList.length>1) return ErrorManager('Tiene que ser un archivo no más');
        if(values.upload && !isJpgOrPng) return ErrorManager('Tiene que ser una imágen png');
        if(values.upload) getBase64(values.upload.file.originFileObj, values.tournament, sendTournament);
        sendTournament("", values.tournament);
    }

    const normFile = e => {
        return e;
      };


    return (
        <Card className="tournamentGestion">
            {tournament ? <TournamentEditor /> :
            <div className="gestion">
            <h1>Gestionar torneos</h1>
            <Button size="large" icon={<UserAddOutlined />} onClick={()=> setShowTournamentForm(!showTournamentForm)}>Añadir torneo </Button>
            <Table className="table" columns={columns} dataSource={user.tournaments} size="small" />

            <Modal className="addTournament" title="Añadir torneo" visible={showTournamentForm} onCancel={()=>setShowTournamentForm(false)} onOk={()=>setShowTournamentForm(false)}>
                <Form onFinish={createTournamentConfirm}>
                    <Form.Item name={['tournament', 'name']} label="Nombre" rules={[{ required: true, message:"Name is required"}]}>
                        <Input placeholder="Nombre del torneo" />
                    </Form.Item>
                    <Form.Item name={['tournament', 'description']} label="Descripcion">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name={'tournament','upload'}
                        label="Suba una foto que se usará como logo del torneo"
                        getValueFromEvent={normFile}
                    >
                        <Upload name="logo" listType="picture">
                        <Button>
                            <UploadOutlined /> Click to upload
                        </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="primary">Crear</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal className="donfirmStep0" title="Añadir torneo" visible={confirm} onCancel={()=>setConfirm(false)} onOk={()=>setConfirm(false)}>
                <p>Si le das a aceptar no podrás volver a atras.</p>
                <p>No volver a mostrar este cartel <Checkbox className="confirmStep1"/></p>
                <Button type="primary" onClick={sendConfirmining}>Confirmar</Button>
            </Modal> </div>}
        </Card>
    )
}

const mapStateToProps =state => {
    return ({
      user:readUser(state), 
      tournament: readTournament(state)
    })
    
  }

export default connect(mapStateToProps, { addTournament, removeTournament, selectTournament })(TournamentGestion);