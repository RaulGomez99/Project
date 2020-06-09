import React, {useState} from "react";
import { Table, Tag, Button, Card, Modal, Input, Form } from "antd";
import { DeleteOutlined, EditOutlined, UserAddOutlined } from "@ant-design/icons";

import { connect } from 'react-redux';
import { readUser, readTournament } from '../../Redux/Reducers/user.reducer'
import { addTournament, removeTournament, selectTournament } from '../../Redux/Actions/user.action'
import TournamentEditor from '../TournamentEditor/tournamenteditor.component'

import Cookies from 'universal-cookie';

import ErrorManager from '../../errorManager';

import './tournamentGestion.css';

const env = require('../../env.json');

const TournamentGestion = ({ user, addTournament, removeTournament, selectTournament, tournament }) => {
    const [showTournamentForm, setShowTournamentForm] = useState(false);

    const columns = [
        {title: "ID", dataIndex: "id", key: "id"},
        {title: "Nombre Torneo", dataIndex: "name", key: "name"},
        {title: "Descripcion", dataIndex: "description", key: "description"},
        {title: "Estado", key: "state", dataIndex: "state", render: state => (
            <span>
                {console.log(state+" asd")}
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
              <EditOutlined style={{ marginRight: 16, cursor:'pointer' }} onClick={() => {tournamentEdit(record.id);}}/>
              <DeleteOutlined style={{ color: "red", cursor:'pointer' }}onClick={() => {deleteTournament(record.id);}}/>
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
        console.log("Borrando "+id)
        removeTournament(id)
    }

    const tournamentEdit = async id => {
        selectTournament(id);
    }

    const createTournament = async (values) => {
        const cookies = new Cookies();
        const token = cookies.get('jwt');
        const data = values;
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


    return (
        <Card className="tournamentGestion">
            {console.log(tournament)}
            {tournament ? <TournamentEditor /> :
            <div className="gestion">
            <h1>Gestionar torneos</h1>
            <Button size="large" icon={<UserAddOutlined />} onClick={()=> setShowTournamentForm(!showTournamentForm)}>Añadir torneo </Button>
            <Table className="table" columns={columns} dataSource={user.tournaments} size="small" />

            <Modal className="addTournament" title="Añadir torneo" visible={showTournamentForm} onCancel={()=>setShowTournamentForm(false)} onOk={()=>setShowTournamentForm(false)}>
                <Form onFinish={createTournament}>
                    <Form.Item name={['tournament', 'name']} label="Nombre" rules={[{ required: true, message:"Name is required"}]}>
                        <Input placeholder="Nombre del torneo" />
                    </Form.Item>
                    <Form.Item name={['tournament', 'description']} label="Descripcion">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="primary">Crear</Button>
                    </Form.Item>
                </Form>
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