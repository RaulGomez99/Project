import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { readUser, readTournament } from '../../Redux/Reducers/user.reducer'
import { addTournament, removeTournament, selectTournament, editTournament } from '../../Redux/Actions/user.action'
import './tournamenteditor.css'
import TournamentMatch from './tournamentmatch.component';
import { ArrowLeftOutlined, FilePdfOutlined }  from "@ant-design/icons"
import { Button, Table, Tooltip } from 'antd';
import ReactStopwatch from 'react-stopwatch';

import Cookies from 'universal-cookie';

import ErrorManager from '../../errorManager';

import pdfCreate from '../../lib/pdfCreate';

const env = require('../../env.json');
const swissTournament = require('../../lib/swissMatching')({maxPerRound:1});

const columns = [
    {title: "Nombre", dataIndex: "id", key: "id"},
    {title: "Elo", dataIndex: "seed", key: "seed"},
    {title: "Puntos", dataIndex: "wins", key: "wins"}
]

const sortAlgorithm = (a, b) => {
    console.log(a,"a");
    console.log(b,"b");
    if(a.dropedOut && b.dropedOut) return 0;
    if(a.dropedOut) return 1;
    if(b.dropedOut) return -1;
    if(a.wins===b.wins){
        return b.seed-a.seed;
    }
    return b.wins-a.wins;

}

const Tournament2Fase = ({tournament, selectTournament, editTournament }) => {  
    
    useEffect(() => {
        const interval = setInterval(() => {
            let time = document.querySelector('#chrono');
            if(time) time=time.innerText;
            else return;
            let [hours, mins, secs] = time.split(':');
            secs++;
            if(secs>=60){
                mins++;
                secs-=60
            }
            if(hours>=60){
                hours++;
                mins-=60;
            }
            hours+="";mins+="";secs+="";
            if(hours<10 && hours.length<2) hours="0"+hours;
            if(mins<10  &&  mins.length<2)  mins ="0"+mins;
            if(secs<10  &&  secs.length<2)  secs ="0"+secs;
            document.querySelector('#chrono').innerHTML = hours+":"+mins+":"+secs;
        }, 1000);
        return () => clearInterval(interval);
      }, []);
    
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
        if(resp.state===-1){ 
            const newTournament = tournament;
            newTournament.state = -1;
            editTournament(tournament.id, newTournament);
            return selectTournament(null);
        }else if(resp.state === -2){

        }
        resp.matches = JSON.parse(resp.matches);
        editTournament(resp.id, resp);
        setTimeout(()=>selectTournament(null),199) 
        setTimeout(()=>selectTournament(resp.id),200) 
    }

    const deshacer = async () => {
        const cookies = new Cookies();
        const token = cookies.get('jwt');
        const json = await fetch(`${env.URL}/api/tournaments/deshacer/${tournament.id}`, {
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
        setTimeout(()=>selectTournament(null),199) 
        setTimeout(()=>selectTournament(resp.id),200) 
    }


    const update = (tourn) => {
        tourn.matches = JSON.parse(tourn.matches);
        if(typeof tourn.participants == "string") tourn.participants = JSON.parse(tourn.participants);
        editTournament(tourn.id, tourn);
        setTimeout(()=>selectTournament(null),199) 
        setTimeout(()=>selectTournament(tourn.id),200) 
    }

    const printRound = () => {
        pdfCreate.generateTournamentPDF(tournament);
    }

    const initialTime = (time) => {
        time = parseInt(time);
        let secs = Math.floor((Date.now() - time)/1000);
        console.log(secs);
        let mins = Math.floor(secs / 60);
        secs %= 60;
        let hours = Math.floor(mins / 60);
        mins %= 60;
        hours+="";mins+="";secs+="";
        if(hours<10 && hours.length<2) hours="0"+hours;
        if(mins<10  &&  mins.length<2)  mins ="0"+mins;
        if(secs<10  &&  secs.length<2)  secs ="0"+secs;
        return hours+":"+mins+":"+secs;
    }

    return (
        <div className="fase2">
            <Tooltip placement="top" className="right" title="Download pdf"><h1  style={{cursor:"pointer"}} onClick={printRound}><FilePdfOutlined /></h1></Tooltip>
            <h1 className="right">Ronda {tournament.state}&nbsp;</h1>
            <h1 className="left backArrow" onClick={()=>selectTournament(-1)}><ArrowLeftOutlined /></h1>
            <h1 style={{textAlign:"center"}}>
                <span id="chrono">{initialTime(tournament.last_upgrade)}</span> / 
                Torneo: {tournament.name}
            </h1>
            {tournament.matches ? <Table size="small" dataSource={swissTournament.getStandings(Infinity, tournament.participants, tournament.matches).sort(sortAlgorithm)} columns={columns} style={{width : "25%", float: "right", height: "50vh"}}/> : ""}
            <div className="matches">

                {tournament.matches ? tournament.matches.filter(match => match.round === tournament.state).map(matchup => {
                    if(matchup.home.id === null || matchup.away.id === null) return "";
                    return <TournamentMatch match={matchup} key={matchup.home.id} id={tournament.id} update={(a)=>update(a)} tournament={tournament}/>;
                }): ""}
            </div>
            <footer >
                <Button type="primary"onClick={changeRound}>Pasar a siguiente fase</Button>
                <Button type="danger"onClick={deshacer}>Deshacer ronda</Button>
            </footer>
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