import React from 'react';
import { Radio, Popover } from 'antd';

import Cookies from 'universal-cookie';

import ErrorManager from '../../errorManager';

const swissTournament = require('../../lib/swissMatching')({maxPerRound:1});

const env = require('../../env.json');

const TournamentMatch = ({ match, id, update, tournament }) => {
    const getDefaultValue = () => {
        if(match.home.points ==   1)   return "1";
        if(match.away.points ==   1)   return "-1";
        if(match.home.points=== 0.5) return "0";
        return null;
    }

    const returnColor = (match, participant, opponent) => {
        if(!match) return;
        if(match.home.points === 1){
            if(match.home.id === participant) return "#22CA00";
            return "red"
        }
        if(match.away.points === 1){
            if(match.away.id === participant) return "#22CA00";
            return "red"
        }else return "gray"
    }

    const contentPopOver = (participant, otherParticipant) => (
        <div>
            { swissTournament.getMappings2(tournament.participants, tournament.matches).filter(player=>player.id===participant)[0].opponents.map(opponent=>{
                if(opponent===otherParticipant) return "";
                return(
                    <p style={{color: returnColor(tournament.matches.filter(match => (
                        (match.home.id === participant || match.home.id === opponent) &&
                        (match.away.id === participant || match.away.id === opponent)
                    ))[0], participant, opponent)
                }}>{opponent}</p>
                )
            })}
        </div>
    )

    const sendPairResult = async (e) => {
        const matchSend = match;
        const { value } = e.target;
        matchSend.round = tournament.state;
        if(value==2 ||value==-2){
            const homeDropedOut = tournament.participants.filter(participant => participant.id === match.home.id)[0].dropedOut;
            const awayDropedOut = tournament.participants.filter(participant => participant.id === match.away.id)[0].dropedOut;
            matchSend.away.points    = value ==  2 ? homeDropedOut ? 0 : awayDropedOut ? 0 : 1 : 0;
            matchSend.home.points    = value == -2 ? awayDropedOut ? 0 : homeDropedOut ? 0 : 1 : 0;
            matchSend.dropedOut = {};
            matchSend.dropedOut.home = value ==  2 ? homeDropedOut ? false : true : undefined;
            matchSend.dropedOut.away = value == -2 ? awayDropedOut ? false : true : undefined;
            e.target.value = value == 2 ? 1 : -1;
        }else{
            matchSend.home.points = value ==  1 ? 1 : value == 0 ? 0.5 : 0;
            matchSend.away.points = value == -1 ? 1 : value == 0 ? 0.5 : 0;
        }

        const cookies = new Cookies();
        const token = cookies.get('jwt');
        const json = await fetch(`${env.URL}/api/tournaments/pairResult/${id}`, {
            method: 'POST',
            body: JSON.stringify(matchSend),
            headers: {
                "Content-Type": "application/json",
                authtoken: token
            }
        });
        const resp = await json.json();
        if(resp.msg) return ErrorManager(resp.msg);  
        update(resp);      
    }

    return (
        <div className="match">
            <h2>Mesa {match.table}</h2>
            <Radio.Group defaultValue={getDefaultValue()} onChange={sendPairResult}>
                <Radio.Button value=" 2" className="white">{tournament.participants.filter(participant => participant.id === match.home.id)[0].dropedOut ? "Volver" : "Abandona"}</Radio.Button>
                <Popover content={contentPopOver(match.home.id,match.away.id)} title="Enfrentamientos jugados"><Radio.Button value= "1" className="white" disabled={tournament.participants.filter(participant => participant.id === match.home.id)[0].dropedOut || false}>{match.home.id}</Radio.Button></Popover>
                {tournament.state <= Math.ceil(Math.log2(tournament.participants.length)) ? <Radio.Button value= "0" className="gray"  disabled={(tournament.participants.filter(participant => participant.id === match.home.id)[0].dropedOut || false) || (tournament.participants.filter(participant => participant.id === match.away.id)[0].dropedOut || false)}>Tablas</Radio.Button>:""}
                <Popover content={contentPopOver(match.away.id,match.home.id)} title="Enfrentamientos jugados"><Radio.Button value="-1" className="black" disabled={tournament.participants.filter(participant => participant.id === match.away.id)[0].dropedOut || false}>{match.away.id}</Radio.Button></Popover>
                <Radio.Button value="-2" className="black">{tournament.participants.filter(participant => participant.id === match.away.id)[0].dropedOut ? "Volver" : "Abandona"}</Radio.Button>
            </Radio.Group>
        </div>
    )
}

export default TournamentMatch;