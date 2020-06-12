import React from 'react';
import { connect } from 'react-redux';
import { readUser, readTournament } from '../../Redux/Reducers/user.reducer'
import { addTournament, removeTournament, selectTournament } from '../../Redux/Actions/user.action'
import './tournamenteditor.css'
import Tournament1Fase from './tournament1fase.component';
import Tournament2Fase from './tournament2fase.component';



const TournamentEditor = ({ tournament }) => {
    return(
        <div className="tournamentEditor">
            {tournament.state === 0 ? <Tournament1Fase/> : tournament.state > 0 ? <Tournament2Fase/> : "FINALIZADO"}
        </div>
    )
}
const mapStateToProps =state => {
    return ({
      user:readUser(state), 
      tournament: readTournament(state)
    })
    
  }

export default connect(mapStateToProps, { addTournament, removeTournament, selectTournament })(TournamentEditor);