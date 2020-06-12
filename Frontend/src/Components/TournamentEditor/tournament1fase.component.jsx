import CSVReader from 'react-csv-reader'
import React, {useState} from 'react';
import { Input, Form, Button, Table, Checkbox, Modal } from 'antd';
import { connect } from 'react-redux';
import { readUser, readTournament } from '../../Redux/Reducers/user.reducer'
import { addTournament, removeTournament, selectTournament, editTournament } from '../../Redux/Actions/user.action'
import ErrorManager from '../../errorManager';
import Cookies from 'universal-cookie';
import './tournamenteditor.css'
import { DeleteOutlined } from "@ant-design/icons";
const env = require('../../env.json');


const Tournament1Fase = ({tournament, editTournament, addTournament, selectTournament }) => {
    const [confirm, setConfirm] = useState(false);

    const sendParticipant = async (values) => {
        const cookies = new Cookies();
        const token = cookies.get('jwt');
        const data = {participant : {
            id: values.participant.name,
            seed: values.participant.seed,
            player: values.participant.player
        }}
        const json = await fetch(`${env.URL}/api/tournaments/addParticipant/${tournament.id}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                authtoken: token
            }
        });
        const resp = await json.json();
        if(resp.msg) return ErrorManager(resp.msg);
        resp.participants = JSON.parse(resp.participants);
        editTournament(resp.id, resp);
        setTimeout(()=>selectTournament(resp.id),200) 
    }

    const deleteParticipant = async (id) => {
        const cookies = new Cookies();
        const token = cookies.get('jwt');
        const json = await fetch(`${env.URL}/api/tournaments/deleteParticipant/${tournament.id}`, {
            method: 'DELETE',
            body: JSON.stringify({idT: id}),
            headers: {
                "Content-Type": "application/json",
                authtoken: token
            }
        });
        const resp = await json.json();
        if(resp.msg) return ErrorManager(resp.msg);
        resp.participants = JSON.parse(resp.participants);
        editTournament(resp.id, resp);
        setTimeout(()=>selectTournament(resp.id),200) 
    }

    const columns = [
        {title: "Nombre", dataIndex: "id", key: "id"},
        {title: "Elo", dataIndex: "seed", key: "seed"},
        {title: "Cuenta", dataIndex: "player", key: "player"},
        {
          title: "Action",
          key: "action",
          render: (text, record) => (
            <span><DeleteOutlined style={{ color: "red", cursor:'pointer' }}onClick={() => {deleteParticipant(record.id);}}/></span>
          )
        }
    ]

    const startTournamentConfirm = () => {
        const cookies = new Cookies();
        if(cookies.get('step2')){
            startTournament();
        }else{
            setConfirm(true);
        }
    }

    const sendConfirmining = () => {
        const cookies = new Cookies();
        console.log("asd");
        if(document.querySelector('.ant-checkbox-input').checked) cookies.set('step2', true);
        console.log("bsd");
        setConfirm(false);
        console.log("csd");
        startTournament();
    }

    const startTournament = async () => {
        console.log("asd");
        const cookies = new Cookies();
        const token = cookies.get('jwt');
        const json = await fetch(`${env.URL}/api/tournaments/startTournament/${tournament.id}`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                authtoken: token
            }
        });
        const resp = await json.json();
        if(resp.msg) return ErrorManager(resp.msg);
        resp.matches = JSON.parse(resp.matches);
        editTournament(resp.id, resp);
        setTimeout(()=>selectTournament(resp.id),200) 
    }

    const sendFile = async (data, fileInfo) =>{
        const dataSend = data.map(participant => ({
            id: participant[0],
            seed : participant[1],
            player: participant[2]
        }));
        console.log(dataSend)
        const cookies = new Cookies();
        const token = cookies.get('jwt');
        console.log(tournament.id)
        const json = await fetch(`${env.URL}/api/tournaments/addCSV/${tournament.id}`, {
            method: 'POST',
            body: JSON.stringify(dataSend),
            headers: {
                "Content-Type": "application/json",
                authtoken: token
            }
        });
        const resp = await json.json();
        const { tournament:tournamento, error } = resp;
        if(error) ErrorManager(error);
        tournamento.participants = JSON.parse(tournamento.participants);
        editTournament(tournamento.id, tournamento);
        setTimeout(()=>selectTournament(tournamento.id),200) 
    }

    return (
        <div className="fase1">
            <h1 style={{textAlign:"center"}}>{tournament.name}</h1>
            <Form onFinish={sendParticipant}>
                <Form.Item label="Nombre participante" name={['participant', 'name']} rules={[{required:true, message:'Name required'}]}>
                    <Input placeholder="Nombre"/>
                </Form.Item>
                <Form.Item label="Elo" name={['participant', 'seed']}>
                    <Input placeholder="Elo"/>
                </Form.Item>
                <Form.Item label="Jugador" name={['participant', 'player']}>
                    <Input placeholder="Jugador"/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit' type="primary">Añadir usuario</Button>
                </Form.Item>
            </Form>
            <CSVReader onFileLoaded={sendFile} label="Importar participantes con CSV "/>
            <div className="participants" style={{height: "50vh"}}>
                <Table dataSource={tournament.participants} columns={columns} className="tablita" size="small"/>
            </div>
            <footer ><Button type="primary"onClick={startTournamentConfirm}>Pasar a siguiente fase</Button></footer>
            <Modal className="donfirmStep0" title="Añadir torneo" visible={confirm} onCancel={()=>setConfirm(false)} onOk={()=>setConfirm(false)}>
                <p>Si le das a aceptar no podrás volver a atras.</p>
                <p>No volver a mostrar este cartel <Checkbox className="confirmStep2"/></p>
                <Button type="primary" onClick={sendConfirmining}>Confirmar</Button>
            </Modal>
        </div>
    )
}

const mapStateToProps = state => {
    return ({
      user:readUser(state), 
      tournament: readTournament(state)
    })
    
  }

export default connect(mapStateToProps, { addTournament, removeTournament, selectTournament, editTournament })(Tournament1Fase);