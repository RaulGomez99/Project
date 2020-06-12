import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Card, Select, Table } from 'antd';

import './tournamentshow.css';
import  TournamentMatch from './tournamentmatch.component';

import ErrorManager from '../../errorManager';

const env = require('../../env.json');
const swissTournament = require('../../lib/swissMatching')({maxPerRound:1});
const { Option } = Select;

const columns = [
    {title: "Nombre", dataIndex: "id", key: "id"},
    {title: "Elo", dataIndex: "seed", key: "seed"},
    {title: "Puntos", dataIndex: "wins", key: "wins"}
]

const sortAlgorithm = (a, b) => {
    if(a.dropedOut && b.dropedOut) return 0;
    if(a.dropedOut) return 1;
    if(b.dropedOut) return -1;
    if(a.wins===b.wins){
        return b.seed-a.seed;
    }
    return b.wins-a.wins;

}

const TournamentShow = () => {
    const { id } = useParams();
    const img404 = require('./404.png');
    const [tournament , setTournament] = useState({});
    const [selected , setSelected] = useState(null);

    const generateSelect = (state) => {
        const retorna = [];
        if(state===-1){
            state = Math.ceil(Math.log2(tournament.participants.length));
        } 
        for(let i = 1; i<=state; i++){
            retorna.push(i);
        }
        return retorna;
    }

    useEffect(()=>{
        const getTournament = async (id) => {
            const json = await fetch(`${env.URL}/api/tournament/${id}`);
            const tournament = await json.json();
            if(tournament.msg) return ErrorManager(tournament.msg);
            setSelected(tournament.state)
            setTournament(tournament);
        }
        getTournament(id);
    }, [])
    let i = 0;

    return(
        <Card className="tournamentShow" bordered={false} >
            {!tournament.name ?
                <span>
                    <h1>Error 404 página no encontrada</h1>
                    <h3>Torneo {id} no existe</h3>
                    <p><img src={img404} alt=""/></p>
                </span> :
                //-------------------
                <div className="tournamentDiv">
                    <h1 className="right">{tournament.state!==-1 ? "Ronda "+tournament.state : "Finalizado"}</h1>
                    {/*generateSelect(tournament.state)*/}
                    <h1>{tournament.name}</h1>
                    {tournament.matches ? <Table size="small" dataSource={swissTournament.getStandings(Infinity, tournament.participants, tournament.matches).sort(sortAlgorithm)} columns={columns} style={{width : "25%", float: "right", height: "50vh"}}/> : ""}
                    <div className="round" style={{overflow:"auto", height:"50vh"}}>
                        {
                            generateSelect(tournament.state).map(round=>{
                                return(
                                    <div>
                                        <h2 style={{textAlign:"center", color:"white"}}>Ronda {round}</h2>
                                        <div className="matches">
                                            {tournament.matches.filter(match => match.round === round).map(matchup=>{
                                                if(matchup.home.id === null || matchup.away.id === null) return "";
                                                return <TournamentMatch match={matchup} key={matchup.home.id}/>
                                            })}
                                        </div>
                                    </div>
                                ) 
                            })
                        }
                        {/* {tournament.matches.map(matchup => {
                            if(i!=matchup.round){
                                i = matchup.round;
                                return <TournamentMatch match={matchup} key={matchup.home.id}/>
                            }
                            if(matchup.home.id === null || matchup.away.id === null) return "";
                            return <TournamentMatch match={matchup} key={matchup.home.id}/>;
                        })} */}
                    </div>
                    
                </div>
            }
        
        </Card>
    )
}

export default TournamentShow;