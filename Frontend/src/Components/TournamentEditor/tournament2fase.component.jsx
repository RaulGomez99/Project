import React from 'react';
import { connect } from 'react-redux';
import { readUser, readTournament } from '../../Redux/Reducers/user.reducer'
import { addTournament, removeTournament, selectTournament, editTournament } from '../../Redux/Actions/user.action'
import './tournamenteditor.css'
import TournamentMatch from './tournamentmatch.component';
import { ArrowLeftOutlined }  from "@ant-design/icons"
import { Button } from 'antd';

import Cookies from 'universal-cookie';

import ErrorManager from '../../errorManager';

const env = require('../../env.json');

const Tournament2Fase = ({tournament, selectTournament, editTournament }) => {
    
    const changeRound = async () => {
        const cookies = new Cookies();
        const token = cookies.get('jwt');
        const json = await fetch(`${env.URL}/api/tournaments/changeRound/${tournament.id}`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                authtoken: token
            }
        });
        const resp = await json.json();
        if(resp.msg) return ErrorManager(resp.msg);
        if(resp.final){ 
            const newTournament = tournament;
            newTournament.state = -1;
            editTournament(tournament.id, newTournament);
            return selectTournament(null);
        }
        resp.matches = JSON.parse(resp.matches);
        editTournament(resp.id, resp);
        setTimeout(()=>selectTournament(null),199) 
        setTimeout(()=>selectTournament(resp.id),200) 
    }

    return (
        <div className="fase2">
            <h1 className="right">Ronda {tournament.state}</h1>
            <h1 className="left backArrow" onClick={()=>selectTournament(-1)}><ArrowLeftOutlined /></h1>
            <h1>{tournament.name}</h1>
            <div className="matches">
                {tournament.matches.filter(match => match.round == tournament.state).map(matchup => {
                    if(matchup.home.id === null || matchup.away.id === null) return "";
                    return <TournamentMatch match={matchup} key={matchup.home.id} id={tournament.id}/>;
                })}
            </div>
            <footer ><Button type="primary"onClick={changeRound}>Pasar a siguiente fase</Button></footer>
        </div>
    )
}

const mapStateToProps = state => {
    return ({
      user:readUser(state), 
      tournament: readTournament(state)
    })
    
  }

export default connect(mapStateToProps, { addTournament, removeTournament, selectTournament, editTournament })(Tournament2Fase);