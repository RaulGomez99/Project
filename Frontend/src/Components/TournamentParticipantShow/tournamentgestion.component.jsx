import React from "react";
import { Table, Tag, Card, Avatar } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { connect } from 'react-redux';
import { readUser } from '../../Redux/Reducers/user.reducer'



import './tournamentGestion.css';
const defaultImg = require('./default.png');

const env = require('../../env.json');

const TournamentGestion = ({ user}) => {

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
              {record.state !=  0 ? <a href={`${env.LOCAL_URL}/tournament/${record.id}`}><EyeOutlined style={{color: "blue", cursor:'pointer' }}/></a>:""}
            </span>
          )
        }
    ]


    return (
        <Card className="tournamentGestion">
            <h1>Ver torneos</h1>
            <Table className="table" columns={columns} dataSource={user.tournamentParticipant.filter(tournament=>tournament.state!=0)} size="small" />
        </Card>
    )
}

const mapStateToProps =state => {
    return ({
      user:readUser(state)
    })
    
  }

export default connect(mapStateToProps)(TournamentGestion);